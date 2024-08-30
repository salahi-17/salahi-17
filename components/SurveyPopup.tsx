"use client";
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const SurveyPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasShownPopup = sessionStorage.getItem('surveyPopupShown');
    
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('surveyPopupShown', 'true');
      }, 5000); // Show popup after 5 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleTakeSurvey = () => {
    // Replace with your actual Mailchimp survey link
    window.open('https://us22.list-manage.com/survey?u=d94960f37fe023354269eaf8d&id=63ec0943c6&attribution=false', '_blank');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-gradient-to-br from-primary-100 to-pink-100 border-2 border-primary">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-primary-800 flex items-center">
            <Sparkles className="mr-2 text-yellow-500" />
            Help Us Improve!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-gray-700">
            We value your opinion! Take our quick survey and help shape the future of our website.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 p-4 bg-white bg-opacity-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Your feedback is crucial in making our website better for everyone. It will only take a few minutes!
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button onClick={handleClose} variant="outline" className="border-purple-300 text-primary hover:bg-primary hover:text-white">
              Maybe Later
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleTakeSurvey} className="bg-primary text-white">
              Take the Survey
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SurveyPopup;