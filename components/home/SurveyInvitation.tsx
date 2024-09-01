"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from 'lucide-react';

const SurveyInvitation = () => {
  const handleSurveyClick = () => {
    window.open('https://us22.list-manage.com/survey?u=d94960f37fe023354269eaf8d&id=63ec0943c6&attribution=false', '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ClipboardList className="h-6 w-6" />
          <span>We Value Your Feedback!</span>
        </CardTitle>
        <CardDescription>
          Help us improve your experience by taking our quick survey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your opinion matters to us! By participating in our survey, you'll help shape the future of our services. It only takes a few minutes, and your insights are invaluable.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleSurveyClick}
        >
          Take the Survey
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyInvitation;