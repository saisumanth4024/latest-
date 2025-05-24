import React from 'react';
import { ModerationQueue } from '../components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from 'lucide-react';

interface ModerationPageProps {
  userId: string;
  className?: string;
}

export const ModerationPage: React.FC<ModerationPageProps> = ({
  userId,
  className = ''
}) => {
  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <CardTitle>Content Moderation Dashboard</CardTitle>
          </div>
          <CardDescription>
            Review and manage user-generated content across the platform. Take action on reported items and enforce community guidelines.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <ModerationQueue userId={userId} />
    </div>
  );
};