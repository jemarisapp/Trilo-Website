
import React from 'react';

export interface Command {
  id: string;
  title: string;
  displayTitle?: React.ReactNode;
  command?: string;
  button?: {
    label: string;
    url: string;
  };
  notes?: string;
  isPro?: boolean;
}

export interface SetupSection {
  id: string;
  title: string;
  description: string;
  steps: Command[];
}

export interface PricingPlan {
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}