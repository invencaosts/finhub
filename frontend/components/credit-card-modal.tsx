"use client"

import { useState } from "react"
import { useFinanceStore } from "@/store/use-finance-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreditCardModalProps {
  children: React.ReactElement
}

export function CreditCardModal({ children }: CreditCardModalProps) {
  const addCard = useFinanceStore((state) => state.addCard)
  const [open, setOpen] = useState(false)
  
  const [name, setName] = useState("")
  const [bankName, setBankName] = useState("")
  const [limit, setLimit] = useState("")
  const [dueDay, setDueDay] = useState("10")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await addCard({
      name,
      bankName,
      limit: parseFloat(limit),
      dueDay: parseInt(dueDay),
    })
    
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setBankName("")
    setLimit("")
    setDueDay("10")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="bg-popover/90 backdrop-blur-2xl border-white/10 text-on-surface sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Novo Cartão de Crédito</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cartão Principal, Nubank Black..." 
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Nome do Banco</Label>
            <Input 
              id="bankName" 
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Ex: Itaú, Santander, BB..." 
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Limite Total (R$)</Label>
              <Input 
                id="limit" 
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="0,00" 
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDay">Dia de Vencimento</Label>
              <Input 
                id="dueDay" 
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-tertiary to-tertiary/80 text-on-tertiary font-bold shadow-[0_4px_15px_rgba(60,221,199,0.3)]">
              Criar Cartão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
