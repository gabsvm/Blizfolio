import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyService } from '../services/company.service';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useLanguageStore } from '../store/useLanguageStore';

// Validation Schema
const companySchema = z.object({
  legalName: z.string().min(2, "Legal name required"),
  commercialName: z.string().min(2, "Commercial name required"),
  industry: z.string().min(1, "Industry required"),
  email: z.string().email(),
  phone: z.string().min(5),
  location: z.object({
    country: z.string().min(1),
    city: z.string().min(1),
    addressLine: z.string().min(1),
  }),
  fiscal: z.object({
    fiscalId: z.string().min(1),
    taxType: z.string(),
  })
});

type CompanyFormValues = z.infer<typeof companySchema>;

export const CompanyProfile: React.FC = () => {
  const { t } = useLanguageStore();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | undefined>(undefined);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema)
  });

  useEffect(() => {
    companyService.getCompany().then((data) => {
      setValue('legalName', data.legalName);
      setValue('commercialName', data.commercialName);
      setValue('industry', data.industry);
      setValue('email', data.email);
      setValue('phone', data.phone);
      setValue('location.country', data.location.country);
      setValue('location.city', data.location.city);
      setValue('location.addressLine', data.location.addressLine);
      setValue('fiscal.fiscalId', data.fiscal.fiscalId);
      setValue('fiscal.taxType', data.fiscal.taxType);
      setLogoUrl(data.logoUrl);
      setLoading(false);
    });
  }, [setValue]);

  const handleUpload = () => {
    // Mock upload flow
    const url = window.prompt("Enter image URL for logo:", "https://picsum.photos/200/200");
    if (url) {
      setLogoUrl(url);
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    setSaving(true);
    try {
      // @ts-ignore - Partial update is safe here for mock
      await companyService.updateCompany({ ...data, logoUrl });
      alert(t('common.success'));
    } catch (e) {
      console.error(e);
      alert(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">{t('common.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('company.title')}</h1>
        <div className="text-sm bg-brand-50 text-brand-700 px-3 py-1 rounded-full">
          Status: Active
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identity Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">🆔 {t('company.identity')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Legal Name" {...register('legalName')} error={errors.legalName?.message} />
            <Input label="Commercial Name" {...register('commercialName')} error={errors.commercialName?.message} />
            <Input label="Industry" {...register('industry')} error={errors.industry?.message} />
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('company.logo')}</label>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                      {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" /> : '🏢'}
                    </div>
                    <Button type="button" variant="secondary" onClick={handleUpload}>{t('company.upload')}</Button>
                </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">📞 {t('company.contact')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">📍 {t('company.location')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Country" {...register('location.country')} error={errors.location?.country?.message} />
            <Input label="City" {...register('location.city')} error={errors.location?.city?.message} />
            <Input label="Address" className="md:col-span-2" {...register('location.addressLine')} error={errors.location?.addressLine?.message} />
          </div>
        </div>

        {/* Fiscal Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">💰 {t('company.fiscal')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fiscal ID (Tax ID)" {...register('fiscal.fiscalId')} error={errors.fiscal?.fiscalId?.message} />
            <Input label="Tax Type" {...register('fiscal.taxType')} error={errors.fiscal?.taxType?.message} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => window.history.back()}>{t('common.cancel')}</Button>
          <Button type="submit" isLoading={saving}>{t('company.save')}</Button>
        </div>
      </form>
    </div>
  );
};