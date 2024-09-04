"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const SurveyInvitation = () => {
  const handleTakeSurvey = () => {
    window.open('https://us22.list-manage.com/survey?u=d94960f37fe023354269eaf8d&id=63ec0943c6&attribution=false', '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8 bg-gradient-to-br from-primary/10 to-pink-100 border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <Sparkles className="mr-2 text-yellow-500" />
          Help Us Improve!
        </CardTitle>
        <p className="text-lg text-gray-700">
          We value your opinion! Take our quick survey and help shape the future of our website.
        </p>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-white bg-opacity-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Your feedback is crucial in making our website better for everyone. It will only take a few minutes!
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={handleTakeSurvey} className="bg-primary text-white hover:bg-primary/90">
          Take the Survey
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyInvitation;