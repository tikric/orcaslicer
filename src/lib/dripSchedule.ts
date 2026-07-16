/**
 * Liberação progressiva dos módulos (drip content).
 * Cada módulo é liberado N dias após o cadastro do aluno (trial_started_at).
 * Admins ignoram esta trava.
 */
export const MODULE_UNLOCK_DAYS: Record<string, number> = {
  qualidade: 0, // libera no ato do cadastro (dividido em 3 seções — ver QUALIDADE_SECTIONS)
  resistencia: 7, // 7 dias depois
  velocidade: 8, // 8 dias depois
  suporte: 8, // 8 dias depois
  multimaterial: 8, // 8 dias depois
  outros: 8, // 8 dias depois
};

/**
 * Dentro do módulo Qualidade, os grupos são liberados em 3 seções,
 * uma a cada 2 dias a partir do cadastro.
 */
export interface QualidadeSection {
  id: string;
  label: string;
  day: number;
  groupIds: string[];
}

export const QUALIDADE_SECTIONS: QualidadeSection[] = [
  {
    id: "q1",
    label: "Seção 1 · Fundamentos",
    day: 0,
    groupIds: ["altura-camada", "largura-linha", "costura"],
  },
  {
    id: "q2",
    label: "Seção 2 · Precisão & Alisamento",
    day: 2,
    groupIds: ["precisao", "precisao-extra", "alisamento", "ironing-extra", "z-contouring"],
  },
  {
    id: "q3",
    label: "Seção 3 · Paredes, Pontes & Saliências",
    day: 4,
    groupIds: ["gerador-paredes", "paredes-superficies", "ponte", "saliencias"],
  },
];

/** Mapa groupId → dia de liberação, derivado de QUALIDADE_SECTIONS. */
const QUALIDADE_GROUP_DAYS: Record<string, number> = QUALIDADE_SECTIONS.reduce(
  (acc, section) => {
    for (const gid of section.groupIds) acc[gid] = section.day;
    return acc;
  },
  {} as Record<string, number>,
);

export function getQualidadeGroupUnlockDay(groupId: string): number {
  return QUALIDADE_GROUP_DAYS[groupId] ?? 0;
}

export function getQualidadeGroupUnlockDate(groupId: string, startedAtISO: string): Date {
  const offset = getQualidadeGroupUnlockDay(groupId);
  return new Date(new Date(startedAtISO).getTime() + offset * 24 * 60 * 60 * 1000);
}

export function isQualidadeGroupUnlocked(
  groupId: string,
  startedAtISO: string,
  now: Date = new Date(),
): boolean {
  return true; // Sempre liberado para acesso completo imediato
}

export function getModuleUnlockDate(moduleId: string, startedAtISO: string): Date {
  return new Date(); // Data atual para liberação imediata
}

export function isModuleUnlocked(
  moduleId: string,
  startedAtISO: string,
  now: Date = new Date(),
): boolean {
  return true; // Sempre liberado para acesso completo imediato
}

/** Formata o tempo restante como "Xd HH:MM:SS" ou "HH:MM:SS" quando menor que 1 dia. */
export function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return "00:00:00";
  const totalSec = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const hms = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}d ${hms}` : hms;
}
