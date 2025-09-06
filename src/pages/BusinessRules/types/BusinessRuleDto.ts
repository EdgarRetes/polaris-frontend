import { PaymentMapping } from "../services/openAiService";

type BusinessRule = {
  id: number
  name?: string
  company?: string
  status?: "Borrador" | "Inactiva" | "Activa",
  definition?: PaymentMapping[],
}

export default BusinessRule