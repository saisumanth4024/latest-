import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectReportForm, 
  selectIsReportModalOpen,
  setReportFormField,
  closeReportModal
} from '../reviewsSlice';
import { useReportReviewMutation, useGetReviewByIdQuery } from '../reviewsApi';
import { ReportReason } from '../types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from 'lucide-react';

// Report reasons with readable labels
const reportReasonLabels: Record<ReportReason, string> = {
  'inappropriate': 'Inappropriate content',
  'spam': 'Spam or promotional',
  'offensive': 'Offensive or abusive language',
  'misleading': 'False or misleading information',
  'off-topic': 'Off-topic or irrelevant',
  'private_info': 'Contains personal or private information',
  'plagiarism': 'Plagiarized content',
  'hate_speech': 'Hate speech',
  'harassment': 'Harassment or bullying',
  'other': 'Other concern'
};

export const ReportModal: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isOpen = useSelector(selectIsReportModalOpen);
  const reportForm = useSelector(selectReportForm);
  
  const [reportReview, { isLoading }] = useReportReviewMutation();
  
  // Get the review details
  const { data: review, isLoading: isLoadingReview } = useGetReviewByIdQuery(
    reportForm.reviewId,
    { skip: !reportForm.reviewId || !isOpen }
  );
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!reportForm.reason) {
      toast({
        title: "Error",
        description: "Please select a reason for your report.",
        variant: "destructive",
      });
      return;
    }
    
    if (reportForm.reason === 'other' && !reportForm.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide more details about your concern.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Submit report
      await reportReview({
        reviewId: reportForm.reviewId,
        reason: reportForm.reason,
        description: reportForm.description
      }).unwrap();
      
      // Close modal and show success message
      dispatch(closeReportModal());
      
      toast({
        title: "Report Submitted",
        description: "Thank you for your feedback. Our team will review this content.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle selecting a reason
  const handleReasonChange = (value: string) => {
    dispatch(setReportFormField({ 
      field: 'reason', 
      value: value as ReportReason 
    }));
  };
  
  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setReportFormField({
      field: 'description',
      value: e.target.value
    }));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeReportModal())}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Review</DialogTitle>
          <DialogDescription>
            Please tell us why you're reporting this content. Our moderation team will review your report.
          </DialogDescription>
        </DialogHeader>
        
        {isLoadingReview ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : review ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Show the review content being reported */}
              <div className="border rounded-md p-3 bg-muted/50">
                <div className="font-medium mb-1">{review.author.name} says:</div>
                <p className="text-sm line-clamp-3">
                  {review.content.type === 'plain_text' 
                    ? review.content.text 
                    : review.content.blocks.map(b => b.content).join(' ')}
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Report</Label>
                <Select 
                  value={reportForm.reason} 
                  onValueChange={handleReasonChange}
                >
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(reportReasonLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">
                  Additional Details 
                  {reportForm.reason === 'other' && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide more information about your report..."
                  value={reportForm.description}
                  onChange={handleDescriptionChange}
                  rows={4}
                />
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p>
                    Our team takes all reports seriously. Submitting false or malicious reports may result 
                    in action against your account.
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => dispatch(closeReportModal())}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Submit Report</>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load review details. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => dispatch(closeReportModal())} 
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};