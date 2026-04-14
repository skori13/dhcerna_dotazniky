import { useState, useCallback } from 'react';
import { FormSelector } from './components/FormSelector';
import { FormWizard } from './components/FormWizard';
import { ReviewScreen } from './components/ReviewScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { GoogleDriveStatus } from './components/GoogleDriveStatus';
import { HistoryScreen } from './components/HistoryScreen';
import { useFormState } from './hooks/useFormState';
import { useGoogleDrive } from './hooks/useGoogleDrive';
import { generatePDF, buildFileName, buildFolderName } from './utils/generatePDF';
import { saveSubmission } from './utils/submissionStore';
import type { Lang } from './i18n/ui-strings';

type Screen = 'select' | 'wizard' | 'review' | 'success' | 'history';

export default function App() {
  const [screen, setScreen] = useState<Screen>('select');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState('');

  const form = useFormState();
  const drive = useGoogleDrive();

  const lang: Lang = form.formConfig?.language ?? 'cs';

  const handleSelectForm = useCallback(
    (config: Parameters<typeof form.selectForm>[0]) => {
      form.selectForm(config);
      setScreen('wizard');
    },
    [form],
  );

  const handleNext = useCallback(() => {
    form.nextSection();
  }, [form]);

  const handleReview = useCallback(() => {
    if (form.goToReview()) {
      setScreen('review');
    }
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!form.formConfig) return;

    const pdf = await generatePDF(form.formConfig, form.formData);
    const name = buildFileName(form.formConfig, form.formData);
    setPdfBlob(pdf);
    setFileName(name);
    setScreen('success');

    // Always save to local IndexedDB backup
    const patientName = `${(form.formData.lastName as string) || ''} ${(form.formData.firstName as string) || ''}`.trim();
    saveSubmission({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      patientName: patientName || 'Unknown',
      formType: form.formConfig.title || form.formConfig.id,
      formLanguage: form.formConfig.language,
      submittedAt: new Date().toISOString(),
      pdfBlob: pdf,
    }).catch(() => {
      // IndexedDB save failed — not critical
    });

    if (drive.isConnected) {
      const folderName = buildFolderName(form.formData);
      await drive.upload(pdf, name, folderName);
    }
  }, [form, drive]);

  const handleNewPatient = useCallback(() => {
    form.reset();
    setPdfBlob(null);
    setFileName('');
    setScreen('select');
  }, [form]);

  const handleBackToSelect = useCallback(() => {
    form.reset();
    setScreen('select');
  }, [form]);

  return (
    <div className="font-['Inter',sans-serif] text-gray-900 min-h-screen">
      <div className="fixed top-3 right-4 z-50">
        <GoogleDriveStatus
          isConnected={drive.isConnected}
          onConnect={drive.connect}
          onDisconnect={drive.disconnect}
          lang={lang}
        />
      </div>

      {screen === 'select' && (
        <FormSelector
          onSelect={handleSelectForm}
          onOpenHistory={() => setScreen('history')}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen onClose={() => setScreen('select')} />
      )}

      {screen === 'wizard' && form.formConfig && (
        <FormWizard
          formConfig={form.formConfig}
          formData={form.formData}
          currentSection={form.currentSection}
          errors={form.errors}
          onUpdateField={form.updateField}
          onNext={handleNext}
          onPrev={form.prevSection}
          onReview={handleReview}
          onBack={handleBackToSelect}
        />
      )}

      {screen === 'review' && form.formConfig && (
        <ReviewScreen
          formConfig={form.formConfig}
          formData={form.formData}
          onSubmit={handleSubmit}
          onBack={() => {
            form.backFromReview();
            setScreen('wizard');
          }}
        />
      )}

      {screen === 'success' && (
        <SuccessScreen
          lang={lang}
          driveUrl={drive.lastUploadUrl}
          pdfBlob={pdfBlob}
          fileName={fileName}
          isUploading={drive.isUploading}
          uploadError={drive.error}
          onNewPatient={handleNewPatient}
        />
      )}
    </div>
  );
}
