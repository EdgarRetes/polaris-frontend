<<<<<<< HEAD
import { PaymentMapping } from "@/services/openAiService";
=======
import { PaymentMapping } from "../services/openAiService";
>>>>>>> d71c888 (Pantall principal template)

type BusinessRule = {
  id: number
  name?: string
  company?: string
  status?: "Borrador" | "Inactiva" | "Activa",
  definition?: PaymentMapping,
}

export default BusinessRule