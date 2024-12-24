import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, ACTIONS, EVENTS, STATUS, Step, Placement } from 'react-joyride';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { cn } from "@/lib/utils";

interface TourStep extends Step {
  target: string;
  content: React.ReactNode;
  disableBeacon: boolean;
  placement: Placement;
  spotlightPadding?: number;
  floaterProps?: {
    disableAnimation: boolean;
  };
  beforeStepShow?: () => void;
}

export const TourGuide = () => {
  const [run, setRun] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      const hasSeenTour = localStorage.getItem('hasSeenTour');
      if (!hasSeenTour) {
        setShowWelcome(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollIntoView = (target: string) => {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const steps: TourStep[] = [
    {
      target: '.day-selector',
      content: 'Start by selecting your travel dates and customize the trip duration using the Add Day button.',
      disableBeacon: true,
      placement: 'right',
      spotlightPadding: 8,
      beforeStepShow: () => scrollIntoView('.day-selector'),
    },
    {
      target: '.hotels-tab',
      content: 'Switch between hotels and activities. Start with hotels - you\'ll need to book accommodation before adding activities.',
      disableBeacon: true,
      placement: 'bottom',
      beforeStepShow: () => scrollIntoView('.hotels-tab'),
    },
    {
      target: '.filters',
      content: 'Use filters to find exactly what you\'re looking for. Filter by location, price range, and more.',
      disableBeacon: true,
      placement: 'bottom',
      beforeStepShow: () => scrollIntoView('.filters'),
    },
    {
      target: '.activity-card',
      content: 'Browse through available options. Click for details or drag and drop to add to your schedule.',
      disableBeacon: true,
      placement: 'left',
      beforeStepShow: () => scrollIntoView('.activity-card'),
    },
    {
      target: '.schedule-view',
      content: 'Drop activities here to build your daily itinerary. Each day is divided into morning, afternoon, and evening slots.',
      disableBeacon: true,
      placement: 'right',
      beforeStepShow: () => scrollIntoView('.schedule-view'),
    },
    {
      target: '.map-toggle',
      content: 'Switch between list and map views to see activity locations and plan your routes efficiently.',
      disableBeacon: true,
      placement: 'bottom',
      beforeStepShow: () => scrollIntoView('.map-toggle'),
    },
    {
      target: '.total-price',
      content: 'Monitor your total trip cost here. The price updates automatically as you add or remove items.',
      disableBeacon: true,
      placement: 'right',
      beforeStepShow: () => scrollIntoView('.total-price'),
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem('hasSeenTour', 'true');
    } else if (action === ACTIONS.CLOSE) {
      setRun(false);
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    if (type === EVENTS.STEP_BEFORE) {
      const currentStep = steps[index];
      if (currentStep.beforeStepShow) {
        currentStep.beforeStepShow();
      }
    }
  };

  const startTour = () => {
    setShowWelcome(false);
    setStepIndex(0);
    setRun(true);
  };

  const skipTour = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  if (!isMounted) return null;

  return (
    <>
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Welcome to Trip Planner! 🌍</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p>Ready to plan your perfect trip?</p>
            <p className="text-sm text-muted-foreground">
              Take a quick tour to learn how to use our planner and make the most of your journey.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={skipTour}>
              Skip Tour
            </Button>
            <Button onClick={startTour} className="gap-2">
              Start Tour
              <span aria-hidden="true">→</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        hideCloseButton
        spotlightPadding={8}
        disableScrollParentFix
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: 'hsl(var(--primary))',
            zIndex: 1000,
            arrowColor: '#fff',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            textColor: '#333',
            spotlightShadow: 'none',
          },
          tooltip: {
            padding: '16px',
            borderRadius: 'var(--radius)',
          },
          tooltipContent: {
            padding: '8px 0',
            fontSize: '14px',
            lineHeight: '1.5',
          },
          tooltipFooter: {
            marginTop: '8px',
          },
          buttonNext: {
            backgroundColor: 'hsl(var(--primary))',
            fontSize: '14px',
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
          },
          buttonBack: {
            color: '#333',
            marginRight: 10,
          },
          buttonSkip: {
            color: '#333',
          },
        }}
        floaterProps={{
          hideArrow: false,
          disableAnimation: false,
          offset: 20,
        }}
      />

      <Button
        variant="outline"
        size="sm"
        className={cn(
          "fixed bottom-4 right-4 z-50",
          "gap-2 shadow-lg hover:shadow-md transition-shadow",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
        onClick={() => setRun(true)}
      >
        <QuestionMarkCircledIcon className="h-4 w-4" />
        Need Help?
      </Button>
    </>
  );
};

export default TourGuide;