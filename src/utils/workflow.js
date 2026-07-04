export const STAGE_BY_ROLE = {
  cook: "COOK",
  pack: "PACK",
  deliverer: "DELIVER",
};

export const BOARD_COLUMNS = [
  { stage: "COOK", label: "Por cocinar" },
  { stage: "PACK", label: "Por empaquetar" },
  { stage: "DELIVER", label: "Por repartir" },
];

export function columnsForRole(role) {
  const stage = STAGE_BY_ROLE[role];
  if (stage) {
    return BOARD_COLUMNS.filter((c) => c.stage === stage);
  }
  // worker/admin: ven todas las etapas activas
  return BOARD_COLUMNS;
}

const WORK_STAGES = ["COOK", "PACK", "DELIVER"];

// El pedido recién creado queda en status "RECEIVED" (aún no hay un
// paso de workflow explícito), pero ya debe poder cocinarse: se trata
// como la etapa COOK. workflow_step manda cuando el backend sí lo informa.
export function currentStage(order) {
  const status = (order.status || "").toUpperCase();
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "RECEIVED") return "COOK";

  const workflowStep = (order.workflow_step || "").toUpperCase();
  if (WORK_STAGES.includes(workflowStep)) return workflowStep;

  const stripped = status.replace("WAITING_", "");
  if (WORK_STAGES.includes(stripped)) return stripped;

  return workflowStep || stripped || null;
}

export function matchesStage(order, stage) {
  return currentStage(order) === stage;
}

export function canCompleteStage(role) {
  return role === "worker" || role === "admin" || !!STAGE_BY_ROLE[role];
}

const DASHBOARD_BUCKETS = ["RECEIVED", "COOK", "PACK", "DELIVER", "COMPLETED"];

export function bucketForStatus(status) {
  const s = (status || "").toUpperCase();
  const stage = DASHBOARD_BUCKETS.find((b) => s === b || s === `WAITING_${b}`);
  return stage || "OTRO";
}

export const DASHBOARD_LABELS = {
  RECEIVED: "Recibidos",
  COOK: "En cocina",
  PACK: "Empacando",
  DELIVER: "En reparto",
  COMPLETED: "Completados",
  OTRO: "Otros",
};
