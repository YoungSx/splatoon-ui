import { Card } from "@/components/ui/card"

export function CardPaperDecorUsage() {
  return (
    <Card
      variant="staple"
      paperLabel={{ text: "SNAP 03", color: "blue", placement: "right" }}
      paperFasteners
    />
  )
}
