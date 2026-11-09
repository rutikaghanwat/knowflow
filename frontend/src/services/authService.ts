/**
 * ============================================================================
 * KNOWFLOW Authentication Service (Development Mock & API Contract)
 * Team: NOVYX | Product: KNOWFLOW
 * ============================================================================
 * 
 * BACKEND WORK STILL REQUIRED:
 * 1. POST /api/auth/login:
 *    - Authenticate credentials via bcrypt/argon2.
 *    - Set httpOnly secure JWT session cookie (do not store auth tokens in localStorage).
 *    - Return user profile with server-verified role perspective.
 * 
 * 2. POST /api/auth/register:
 *    - Authorised initial registration: Must enforce single-tenant initial bootstrap
 *      or validated domain registration.
 *    - Creates Organization, Workspace, and assigns 'manager' (admin) role.
 *    - Sends email verification link with cryptographic signature.
 * 
 * 3. GET /api/auth/invite/:token:
 *    - Cryptographically verify HMAC-SHA256 signature and check expiration timestamp.
 *    - Check single-use status (reject if already consumed).
 *    - Ensure invitations NEVER grant manager privileges (strictly 'departing' or 'incoming').
 * 
 * 4. POST /api/auth/invite/accept:
 *    - Binds user password, activates account, records audit log entry.
 * ============================================================================
 */

import { UserRolePerspective, HandoverRole } from '../types';

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  role: HandoverRole;
  perspective: UserRolePerspective;
  organization: string;
  avatar: string;
  activeProjectName: string;
  activeHandoverId?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  organizationName: string;
  designation: string;
}

export interface InviteValidationResult {
  isValid: boolean;
  errorType?: 'expired' | 'used' | 'invalid_token' | 'revoked';
  errorMessage?: string;
  inviteDetails?: {
    organization: string;
    projectName: string;
    roleName: string;
    perspective: 'departing' | 'incoming' | 'member';
    email: string;
    inviterName: string;
    expiresAt: string;
  };
}

export const mockUsers: Record<string, AuthSessionUser> = {
  manager: {
    id: 'usr-1',
    name: 'Sarah Lin',
    email: 'sarah.lin@knowflow.io',
    role: 'Project Manager',
    perspective: 'manager',
    organization: 'Acme Technologies Inc.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    activeProjectName: 'Core Payments & Ledger Migration',
    activeHandoverId: 'ho-01',
  },
  departing: {
    id: 'usr-2',
    name: 'Rutika Ghanwat',
    email: 'rutika.g@knowflow.io',
    role: 'Backend Developer',
    perspective: 'departing',
    organization: 'Acme Technologies Inc.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    activeProjectName: 'Core Payments & Ledger Migration',
    activeHandoverId: 'ho-01',
  },
  incoming: {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@knowflow.io',
    role: 'Backend Developer',
    perspective: 'incoming',
    organization: 'Acme Technologies Inc.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    activeProjectName: 'Core Payments & Ledger Migration',
    activeHandoverId: 'ho-01',
  },
};

export const AuthService = {
  /**
   * Universal Login:
   * Role is NEVER chosen by user. It is determined exclusively by the server account record.
   */
  async login(email: string, _password?: string): Promise<{ success: boolean; user: AuthSessionUser; redirectUrl: string }> {
    // Simulated network delay
    await new Promise((r) => setTimeout(r, 400));

    const normalized = email.trim().toLowerCase();
    let user: AuthSessionUser;

    if (normalized.includes('rutika') || normalized.includes('departing')) {
      user = mockUsers.departing;
    } else if (normalized.includes('marcus') || normalized.includes('incoming')) {
      user = mockUsers.incoming;
    } else {
      user = mockUsers.manager;
    }

    const redirectUrl = user.perspective === 'manager' ? '/app/overview' : '/employee/overview';
    return { success: true, user, redirectUrl };
  },

  /**
   * Manager / Admin Workspace Registration
   */
  async register(payload: RegisterPayload): Promise<{ success: boolean; requiresEmailVerification: boolean; user: AuthSessionUser }> {
    await new Promise((r) => setTimeout(r, 600));

    const user: AuthSessionUser = {
      id: `usr-${Date.now()}`,
      name: payload.fullName,
      email: payload.email,
      role: 'Project Manager',
      perspective: 'manager',
      organization: payload.organizationName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      activeProjectName: 'Primary Workspace',
    };

    return {
      success: true,
      requiresEmailVerification: true,
      user,
    };
  },

  /**
   * Server Token Validation for Invitations
   */
  async validateInviteToken(token: string): Promise<InviteValidationResult> {
    await new Promise((r) => setTimeout(r, 300));

    const cleanToken = token.trim().toLowerCase();

    // Simulated token scenarios:
    if (cleanToken === 'expired' || cleanToken.includes('expired')) {
      return {
        isValid: false,
        errorType: 'expired',
        errorMessage: 'This invitation link has expired (valid for 7 days). Please ask your project manager to resend an invite.',
      };
    }

    if (cleanToken === 'used' || cleanToken.includes('used')) {
      return {
        isValid: false,
        errorType: 'used',
        errorMessage: 'This invitation has already been accepted. Please sign in with your email and password.',
      };
    }

    if (cleanToken.includes('tampered') || (cleanToken.length < 5 && !cleanToken.includes('inv'))) {
      return {
        isValid: false,
        errorType: 'invalid_token',
        errorMessage: 'This invitation link is invalid or corrupted. Please verify the URL in your email.',
      };
    }

    // Marcus Vance -> Incoming Replacement
    if (cleanToken.includes('marcus') || cleanToken.includes('incoming')) {
      return {
        isValid: true,
        inviteDetails: {
          organization: 'Acme Technologies Inc.',
          projectName: 'Core Payments & Ledger Migration',
          roleName: 'Backend Developer (Incoming)',
          perspective: 'incoming',
          email: 'marcus.vance@knowflow.io',
          inviterName: 'Sarah Lin (Project Manager)',
          expiresAt: 'In 5 days',
        },
      };
    }

    // Default valid invite -> Rutika Ghanwat (Departing Member)
    return {
      isValid: true,
      inviteDetails: {
        organization: 'Acme Technologies Inc.',
        projectName: 'Core Payments & Ledger Migration',
        roleName: 'Backend Developer (Departing)',
        perspective: 'departing',
        email: 'rutika.g@knowflow.io',
        inviterName: 'Sarah Lin (Project Manager)',
        expiresAt: 'In 6 days',
      },
    };
  },

  /**
   * Complete invitation acceptance and set password
   */
  async acceptInvitation(
    token: string,
    _password: string
  ): Promise<{ success: boolean; user: AuthSessionUser; redirectUrl: string }> {
    await new Promise((r) => setTimeout(r, 500));

    const val = await this.validateInviteToken(token);
    if (!val.isValid || !val.inviteDetails) {
      throw new Error(val.errorMessage || 'Invalid invitation');
    }

    const user = val.inviteDetails.perspective === 'incoming' ? mockUsers.incoming : mockUsers.departing;
    return {
      success: true,
      user,
      redirectUrl: '/employee/overview',
    };
  },
};
