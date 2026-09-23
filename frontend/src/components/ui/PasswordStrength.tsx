
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { id: 'length', label: 'Minimum 8 characters', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'At least one lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'At least one number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'At least one special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  const metCount = requirements.filter((req) => req.test(password)).length;
  const progress = (metCount / requirements.length) * 100;
  
  let strengthLabel = 'Very Weak';
  let colorClass = 'bg-red-500';
  if (metCount === requirements.length) {
    strengthLabel = 'Strong';
    colorClass = 'bg-green-500';
  } else if (metCount >= 3) {
    strengthLabel = 'Fair';
    colorClass = 'bg-yellow-500';
  } else if (metCount >= 1) {
    strengthLabel = 'Weak';
    colorClass = 'bg-orange-500';
  }

  // Only show detailed feedback if they started typing
  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-gray-700">
        <span>Password Strength</span>
        <span>{strengthLabel}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-300 ease-out", colorClass)}
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="space-y-1.5 mt-2">
        {requirements.map((req) => {
          const isMet = req.test(password);
          return (
            <li key={req.id} className="flex items-center text-xs text-gray-600">
              {isMet ? (
                <Check className="h-3 w-3 text-green-500 mr-2 shrink-0" />
              ) : (
                <X className="h-3 w-3 text-gray-300 mr-2 shrink-0" />
              )}
              <span className={cn(isMet && "text-gray-900")}>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const isPasswordValid = (password: string) => {
  return requirements.every((req) => req.test(password));
};
