import { useState, useEffect } from "react"
import { useFinanceStore, CreditCard } from "@/store/use-finance-store"
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
  children?: React.ReactElement
  initialData?: CreditCard
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function CreditCardModal({ children, initialData, open: externalOpen, onOpenChange }: CreditCardModalProps) {
  const { addCard, updateCard, removeCard } = useFinanceStore()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen
  
  const [name, setName] = useState("")
  const [bankName, setBankName] = useState("")
  const [displayLimit, setDisplayLimit] = useState("")
  const [dueDay, setDueDay] = useState("10")

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (!cleanValue) return ""
    const numberValue = parseFloat(cleanValue) / 100
    return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayLimit(formatCurrency(e.target.value))
  }

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name)
        setBankName(initialData.bankName || "")
        setDisplayLimit(initialData.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
        setDueDay(initialData.dueDay.toString())
      } else {
        resetForm()
      }
    }
  }, [open, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numericLimit = parseFloat(displayLimit.replace(/\./g, '').replace(',', '.'))
    
    const data = {
      name,
      bankName,
      limit: numericLimit,
      dueDay: parseInt(dueDay),
    }

    if (initialData) {
      await updateCard(initialData.id, data)
    } else {
      await addCard(data)
    }
    
    setOpen(false)
    if (!initialData) resetForm()
  }

  const handleDelete = async () => {
    if (initialData && confirm("Tem certeza que deseja excluir este cartão?")) {
      await removeCard(initialData.id)
      setOpen(false)
    }
  }

  const resetForm = () => {
    setName("")
    setBankName("")
    setDisplayLimit("")
    setDueDay("10")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="bg-[#122131] border-white/20 text-on-surface sm:max-w-[425px] shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            {initialData ? 'Editar Cartão' : 'Novo Cartão de Crédito'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cartão Principal, Nubank Black..." 
              className="input-standard"
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
              className="input-standard"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Limite Total (R$)</Label>
              <Input 
                id="limit" 
                value={displayLimit}
                onChange={handleLimitChange}
                placeholder="0,00" 
                className="input-standard font-bold"
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
                className="input-standard"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-6 flex flex-row gap-3">
            {initialData && (
              <Button 
                type="button"
                onClick={handleDelete}
                className="flex-1 h-12 font-bold bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20 rounded-xl cursor-pointer"
              >
                Excluir
              </Button>
            )}
            <Button 
              type="submit" 
              className="flex-1 h-12 bg-tertiary text-white font-bold shadow-lg shadow-tertiary/20 rounded-xl hover:bg-tertiary/90 transition-all cursor-pointer"
            >
              {initialData ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
