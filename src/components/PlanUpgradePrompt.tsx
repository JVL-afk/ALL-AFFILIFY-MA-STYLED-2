'use client'

import React from 'react';
import Link from 'next/link';
import { Crown, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlanType } from '@/lib/plan-middleware';

interface PlanUpgradePromptProps {
  currentPlan: PlanType;
  requiredPlan: PlanType;
  featureName: string;
  description?: string;
}

export default function PlanUpgradePrompt({
  currentPlan,
  requiredPlan,
  featureName,
  description
}: PlanUpgradePromptProps) {
  // Define plan hierarchy for comparison
  const planHierarchy = {
    'basic': 1,
    'pro': 2,
    'enterprise': 3
  };

  // If user already has access to this feature, don't show the prompt
  if (planHierarchy[currentPlan] >= planHierarchy[requiredPlan]) {
    return null;
  }

  // Get the plan icon based on the required plan
  const getPlanIcon = () => {
    switch (requiredPlan) {
      case 'pro':
        return <Crown className="w-6 h-6 text-purple-500" />;
      case 'enterprise':
        return <Sparkles className="w-6 h-6 text-orange-500" />;
      default:
        return <Zap className="w-6 h-6 text-blue-500" />;
    }
  };

  // Get the plan color based on the required plan
  const getPlanColor = () => {
    switch (requiredPlan) {
      case 'pro':
        return 'bg-purple-600/20 border-purple-600/30 text-purple-300';
      case 'enterprise':
        return 'bg-orange-600/20 border-orange-600/30 text-orange-300';
      default:
        return 'bg-blue-600/20 border-blue-600/30 text-blue-300';
    }
  };

  // Get the plan gradient based on the required plan
  const getPlanGradient = () => {
    switch (requiredPlan) {
      case 'pro':
        return 'from-purple-600 to-blue-600';
      case 'enterprise':
        return 'from-orange-600 to-red-600';
      default:
        return 'from-blue-600 to-cyan-600';
    }
  };

  // Get the plan benefits based on the required plan
  const getPlanBenefits = () => {
    switch (requiredPlan) {
      case 'pro':
        return [
          'Advanced Analytics',
          'AI Chatbot',
          'Email Marketing',
          'Custom Integrations',
          '25 Website Limit (vs 3 for Basic)'
        ];
      case 'enterprise':
        return [
          'Team Collaboration',
          'API Management',
          'Advanced Reporting',
          'A/B Testing',
          'Unlimited Websites'
        ];
      default:
        return [];
    }
  };

  return (
    <div className={`rounded-lg border ${getPlanColor()} p-6 mb-8`}>
      <div className="flex items-center mb-4">
        {getPlanIcon()}
        <h2 className="text-xl font-bold ml-2 text-white">
          Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} to Access {featureName}
        </h2>
      </div>
      
      {description && (
        <p className="text-white/80 mb-4">{description}</p>
      )}
      
      <div className="mb-6">
        <h3 className="text-white font-medium mb-2">
          {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Plan Includes:
        </h3>
        <ul className="space-y-2">
          {getPlanBenefits().map((benefit, index) => (
            <li key={index} className="flex items-center text-white/80">
              <ArrowRight className="w-4 h-4 mr-2 text-white/60" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-center">
        <Link href={`/login?upgrade=${requiredPlan}&from=${currentPlan}&feature=${encodeURIComponent(featureName)}`}>
          <Button className={`bg-gradient-to-r ${getPlanGradient()} hover:opacity-90 text-white`}>
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
          </Button>
        </Link>
      </div>
    </div>
  );
}
