'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Clock, Monitor, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';

interface SimpleSettings {
  // Queue Settings
  max_queue_size: number;
  auto_call_next: boolean;
  
  // Display Settings
  display_refresh_interval: number;
  show_wait_times: boolean;
  language: string;
  default_ticker_message: string;  // NEW: Default ticker message
  
  // Business Hours
  monday_open: string;
  monday_close: string;
  tuesday_open: string;
  tuesday_close: string;
  wednesday_open: string;
  wednesday_close: string;
  thursday_open: string;
  thursday_close: string;
  friday_open: string;
  friday_close: string;
  saturday_open: string;
  saturday_close: string;
  sunday_open: string;
  sunday_close: string;
  is_monday_open: boolean;
  is_tuesday_open: boolean;
  is_wednesday_open: boolean;
  is_thursday_open: boolean;
  is_friday_open: boolean;
  is_saturday_open: boolean;
  is_sunday_open: boolean;
  
  // Maintenance
  maintenance_mode: boolean;
  maintenance_message: string;
  
  // Organization
  organization_name: string;
  support_email: string;
  support_phone: string;
}

const DEFAULT_SETTINGS: SimpleSettings = {
  max_queue_size: 100,
  auto_call_next: true,
  display_refresh_interval: 5,
  show_wait_times: true,
  language: 'en',
  default_ticker_message: 'Welcome to CASURECO II Queue Management System • Please wait for your number to be called • Thank you for your patience',
  monday_open: '08:00',
  monday_close: '17:00',
  tuesday_open: '08:00',
  tuesday_close: '17:00',
  wednesday_open: '08:00',
  wednesday_close: '17:00',
  thursday_open: '08:00',
  thursday_close: '17:00',
  friday_open: '08:00',
  friday_close: '17:00',
  saturday_open: '08:00',
  saturday_close: '12:00',
  sunday_open: '08:00',
  sunday_close: '12:00',
  is_monday_open: true,
  is_tuesday_open: true,
  is_wednesday_open: true,
  is_thursday_open: true,
  is_friday_open: true,
  is_saturday_open: false,
  is_sunday_open: false,
  maintenance_mode: false,
  maintenance_message: 'System is currently under maintenance. Please check back later.',
  organization_name: 'NAGA Queue System',
  support_email: 'support@example.com',
  support_phone: '+1234567890',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SimpleSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data } = await apiClient.get<{ settings: SimpleSettings }>('/settings/system');
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient.post('/settings/system', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(DEFAULT_SETTINGS);
      toast.info('Settings reset to default values');
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Configure essential system preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white shadow-lg p-1 rounded-xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business Hours</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Queue Settings */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Queue Settings
                </CardTitle>
                <CardDescription>Configure queue behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max_queue">Maximum Queue Size</Label>
                  <Input
                    id="max_queue"
                    type="number"
                    value={settings.max_queue_size}
                    onChange={(e) => setSettings({ ...settings, max_queue_size: parseInt(e.target.value) })}
                    min="1"
                    max="1000"
                  />
                  <p className="text-xs text-gray-500">Maximum number of tickets in queue</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Auto Call Next Ticket</Label>
                    <p className="text-xs text-gray-500">Automatically call next ticket</p>
                  </div>
                  <Switch
                    checked={settings.auto_call_next}
                    onCheckedChange={(checked) => setSettings({ ...settings, auto_call_next: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  Display Settings
                </CardTitle>
                <CardDescription>Configure display behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="refresh_interval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refresh_interval"
                    type="number"
                    value={settings.display_refresh_interval}
                    onChange={(e) => setSettings({ ...settings, display_refresh_interval: parseInt(e.target.value) })}
                    min="1"
                    max="60"
                  />
                  <p className="text-xs text-gray-500">How often to refresh the display</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fil">Filipino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticker_message">Default Ticker Message</Label>
                  <Textarea
                    id="ticker_message"
                    value={settings.default_ticker_message}
                    onChange={(e) => setSettings({ ...settings, default_ticker_message: e.target.value })}
                    rows={3}
                    placeholder="Message to display on scrolling ticker when no announcements"
                  />
                  <p className="text-xs text-gray-500">Shown on display screen when no active announcements</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Show Wait Times</Label>
                    <p className="text-xs text-gray-500">Display estimated wait times</p>
                  </div>
                  <Switch
                    checked={settings.show_wait_times}
                    onCheckedChange={(checked) => setSettings({ ...settings, show_wait_times: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Organization Details */}
            <Card className="bg-white shadow-lg md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  Organization Details
                </CardTitle>
                <CardDescription>Basic organization information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="org_name">Organization Name</Label>
                    <Input
                      id="org_name"
                      value={settings.organization_name}
                      onChange={(e) => setSettings({ ...settings, organization_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support_email">Support Email</Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={settings.support_email}
                      onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support_phone">Support Phone</Label>
                    <Input
                      id="support_phone"
                      value={settings.support_phone}
                      onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="business" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Operating Hours
              </CardTitle>
              <CardDescription>Set your business hours for each day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const dayKey = day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
                  const isOpenKey = `is_${dayKey}_open` as keyof SimpleSettings;
                  const openKey = `${dayKey}_open` as keyof SimpleSettings;
                  const closeKey = `${dayKey}_close` as keyof SimpleSettings;
                  
                  return (
                    <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-32">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={settings[isOpenKey] as boolean}
                            onCheckedChange={(checked) => setSettings({ ...settings, [isOpenKey]: checked })}
                          />
                          <Label className="capitalize font-medium">{day}</Label>
                        </div>
                      </div>
                      {settings[isOpenKey] ? (
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-gray-600">Open:</Label>
                            <Input
                              type="time"
                              value={settings[openKey] as string}
                              onChange={(e) => setSettings({ ...settings, [openKey]: e.target.value })}
                              className="w-32"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-gray-600">Close:</Label>
                            <Input
                              type="time"
                              value={settings[closeKey] as string}
                              onChange={(e) => setSettings({ ...settings, [closeKey]: e.target.value })}
                              className="w-32"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Closed</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Mode */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Maintenance Mode
              </CardTitle>
              <CardDescription>Control system availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <Label className="font-medium">Enable Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">System will be unavailable to users</p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance_message">Maintenance Message</Label>
                <Textarea
                  id="maintenance_message"
                  value={settings.maintenance_message}
                  onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                  rows={3}
                  placeholder="Message to display during maintenance"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
