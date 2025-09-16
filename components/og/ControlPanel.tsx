// FIX: Create the ControlPanel component with system controls and other widgets.
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { useOGStore, useOGStoreActions } from '../../store/useOG';
import { Checkbox } from './ui/Checkbox';
import { Slider } from './ui/Slider';
import Analytics from './Analytics';
import RiskCockpit from './RiskCockpit';

const ControlPanel: React.FC = () => {
  const { toggleAutoscroll } = useOGStoreActions();
  const autoscroll = useOGStore(state => state.autoscroll);

  return (
    <div className="h-full flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle>System Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="autoscroll-cb" className="text-sm font-medium">Autoscroll Feed</label>
                    {/* FIX: The Checkbox component wraps a native input, which uses the 'onChange' event handler, not 'onCheckedChange'. */}
                    <Checkbox id="autoscroll-cb" checked={autoscroll} onChange={() => toggleAutoscroll()} />
                </div>
                 <div className="space-y-2">
                    <label htmlFor="risk-slider" className="text-sm font-medium">Risk Appetite</label>
                    <Slider id="risk-slider" defaultValue={50} />
                 </div>
                <Button variant="destructive" className="w-full">Emergency Stop All</Button>
            </CardContent>
        </Card>
        <Analytics />
        <RiskCockpit />
    </div>
  );
};

export default ControlPanel;