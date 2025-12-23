'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormData } from '@/lib/validations/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Briefcase, Clock, Palette, Tag, FileText, AlertCircle, Loader2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  existingServices?: Array<{ name: string; prefix: string; id?: string }>;
  editingServiceId?: string;
}

export function ServiceForm({ 
  defaultValues, 
  onSubmit, 
  onCancel,
  isSubmitting = false,
  existingServices = [],
  editingServiceId 
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    trigger,
    formState: { errors, isDirty, touchedFields },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: 'onBlur', // Validate on blur
    defaultValues: {
      name: '',
      prefix: '',
      description: '',
      avg_service_time: 300, // 5 minutes default
      color: '#3b82f6',
      icon: '',
      is_active: true,
      branch_id: '071aa7e0-d588-11f0-93ae-088fc3019fcf', // Main branch ID
      ...defaultValues,
    },
  });

  const avgServiceTime = watch('avg_service_time');
  const color = watch('color');
  const isActive = watch('is_active');

  // Helper to get field state classes
  const getFieldClasses = (fieldName: keyof ServiceFormData) => {
    const hasError = errors[fieldName];
    const isTouched = touchedFields[fieldName];
    
    return cn(
      'transition-all duration-200',
      hasError && 'border-red-500 focus:ring-red-500 bg-red-50',
      !hasError && isTouched && 'border-green-500 focus:ring-green-500 bg-green-50'
    );
  };

  const handleFormSubmit = async (data: ServiceFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    
    // Check for duplicate name
    const duplicateName = existingServices.find(
      (service) => 
        service.name.toLowerCase() === data.name.toLowerCase() && 
        service.id !== editingServiceId
    );
    if (duplicateName) {
      console.log('Duplicate name found:', duplicateName);
      setError('name', { 
        type: 'manual', 
        message: 'A service with this name already exists' 
      });
      return;
    }

    // Check for duplicate prefix
    const duplicatePrefix = existingServices.find(
      (service) => 
        service.prefix.toUpperCase() === data.prefix.toUpperCase() && 
        service.id !== editingServiceId
    );
    if (duplicatePrefix) {
      console.log('Duplicate prefix found:', duplicatePrefix);
      setError('prefix', { 
        type: 'manual', 
        message: 'A service with this prefix already exists' 
      });
      return;
    }

    console.log('Calling onSubmit with data:', data);
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Please fix the following errors:</h4>
              <ul className="mt-2 space-y-1 text-sm text-red-700">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {field}: {error?.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="p-2 rounded-xl bg-blue-600 shadow-md">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
            <p className="text-sm text-gray-600">Service details and identification</p>
          </div>
        </div>

        {/* Service Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            Service Name
            <span className="text-red-500">*</span>
            {!errors.name && touchedFields.name && (
              <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
            )}
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Bill Payment, New Connection"
            className={getFieldClasses('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Service Prefix */}
        <div className="space-y-2">
          <Label htmlFor="prefix" className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-600" />
            Service Prefix
            <span className="text-red-500">*</span>
            {!errors.prefix && touchedFields.prefix && (
              <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
            )}
          </Label>
          <Input
            id="prefix"
            {...register('prefix')}
            placeholder="e.g., BP, NC, INQ"
            maxLength={10}
            className={cn(getFieldClasses('prefix'), 'uppercase')}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              register('prefix').onChange(e);
            }}
          />
          <p className="text-xs text-gray-500">
            Used for ticket numbering (e.g., BP001). Only uppercase letters and numbers.
          </p>
          {errors.prefix && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.prefix.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            Description
            {!errors.description && touchedFields.description && (
              <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
            )}
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Brief description of the service..."
            rows={3}
            className={getFieldClasses('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Service Configuration Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="p-2 rounded-xl bg-purple-600 shadow-md">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Service Configuration</h3>
            <p className="text-sm text-gray-600">Time and display settings</p>
          </div>
        </div>

        {/* Average Service Time */}
        <div className="space-y-2">
          <Label htmlFor="avg_service_time" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            Average Service Time (minutes)
            <span className="text-red-500">*</span>
            {!errors.avg_service_time && touchedFields.avg_service_time && (
              <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
            )}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="avg_service_time"
              type="number"
              value={Math.floor(avgServiceTime / 60)}
              onChange={(e) => {
                const minutes = parseInt(e.target.value) || 1;
                setValue('avg_service_time', minutes * 60, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
              }}
              onBlur={() => trigger('avg_service_time')}
              min="1"
              max="120"
              className={cn(getFieldClasses('avg_service_time'), 'w-32')}
            />
            <span className="text-sm text-gray-600">
              = {Math.floor(avgServiceTime / 60)} minute{Math.floor(avgServiceTime / 60) !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Estimated time to complete this service
          </p>
          {errors.avg_service_time && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.avg_service_time.message}
            </p>
          )}
        </div>

        {/* Service Color */}
        <div className="space-y-2">
          <Label htmlFor="color" className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-600" />
            Service Color
            <span className="text-red-500">*</span>
            {!errors.color && touchedFields.color && (
              <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
            )}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="color"
              type="color"
              {...register('color')}
              className="w-20 h-12 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setValue('color', e.target.value, { shouldValidate: true, shouldDirty: true })}
              onBlur={() => trigger('color')}
              placeholder="#3b82f6"
              className={cn(getFieldClasses('color'), 'flex-1 font-mono')}
            />
            <div 
              className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: color }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Color for service identification in the system
          </p>
          {errors.color && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.color.message}
            </p>
          )}
        </div>

        {/* Icon (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="icon" className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-600" />
            Icon (Optional)
            {!errors.icon && touchedFields.icon && (
              <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
            )}
          </Label>
          <Input
            id="icon"
            {...register('icon')}
            placeholder="e.g., credit-card, user, settings"
            className={getFieldClasses('icon')}
          />
          <p className="text-xs text-gray-500">
            Lucide icon name for display (leave empty for default)
          </p>
          {errors.icon && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.icon.message}
            </p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-0.5">
            <Label htmlFor="is_active" className="text-base font-medium cursor-pointer">
              Service Status
            </Label>
            <p className="text-sm text-gray-600">
              {isActive ? 'Service is active and available' : 'Service is inactive'}
            </p>
          </div>
          <Switch
            id="is_active"
            checked={isActive}
            onCheckedChange={(checked) => setValue('is_active', checked, { shouldValidate: true, shouldDirty: true })}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[100px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Service
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
