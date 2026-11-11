import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layers, Mail } from 'lucide-react';

export const InviteAcceptPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  return (
    <main className="min-h-screen bg-[#FAF8FC] flex items-center justify-center px-5 py-12">
      <section className="w-full max-w-md bg-white border border-[#E8E0EF] rounded-2xl p-8 shadow-sm text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-[#32164C] text-white grid place-items-center"><Layers size={22}/></div>
        <h1 className="mt-5 text-2xl font-bold text-[#32164C]">Invitation setup</h1>
        <p className="mt-3 text-sm leading-6 text-[#697586]">This invitation link {token ? 'was received' : 'is missing'}, but invitation creation and token validation are not enabled in the current backend yet. Ask your workspace manager to add you after signing in.</p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#704B91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5D3B7B]"><Mail size={16}/> Go to sign in</Link>
      </section>
    </main>
  );
};
