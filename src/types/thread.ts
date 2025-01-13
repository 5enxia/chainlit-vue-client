import type { IElement } from './element';
import type { IStep } from './step';

export interface IThread {
  id: string;
  createdAt: number | string;
  name?: string;
  userId?: string;
  userIdentifier?: string;
  metadata?: Record<string, any>;
  steps: IStep[];
  elements?: IElement[];
}
