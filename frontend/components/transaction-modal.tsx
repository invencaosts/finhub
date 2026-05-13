"use client"

import { useState, useEffect } from "react"
import { useFinanceStore } from "@/store/use-finance-store"
import { useCategoryStore } from "@/store/use-category-store"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TransactionModalProps {
  type: 'income' | 'expense'
  children: React.ReactElement
}

export function TransactionModal({ type, children }: TransactionModalProps) {
  const addTransaction = useFinanceStore((state) => state.addTransaction)
  const cards = useFinanceStore((state) => state.cards)
  const { categories, fetchCategories } = useCategoryStore()
  
  const [open, setOpen] = useState(false)
  
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [bankName, setBankName] = useState("")
  const [creditCardId, setCreditCardId] = useState<string>("")
  const [totalInstallments, setTotalInstallments] = useState("1")

  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open, fetchCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category: category || "Outros",
      date,
      bankName: type === 'income' ? bankName : undefined,
      creditCardId: creditCardId ? parseInt(creditCardId) : undefined,
      totalInstallments: parseInt(totalInstallments),
    })
    
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setDescription("")
    setAmount("")
    setCategory("")
    setDate(new Date().toISOString().split('T')[0])
    setBankName("")
    setCreditCardId("")
    setTotalInstallments("1")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="bg-popover/90 backdrop-blur-2xl border-white/10 text-on-surface sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            Adicionar {type === 'income' ? 'Renda' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aluguel, Salário, Netflix..." 
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input 
                id="amount" 
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00" 
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input 
                id="date" 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(val) => setCategory(val || "")}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-white/10">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {type === 'income' ? (
              <div className="space-y-2">
                <Label htmlFor="bank">Recebido em (Banco)</Label>
                <Input 
                  id="bank" 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ex: BB, Nubank..." 
                  className="bg-white/5 border-white/10"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="card">Pagamento (Opcional)</Label>
                <Select value={creditCardId} onValueChange={(val) => setCreditCardId(val || "")}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Dinheiro/PIX" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-white/10">
                    <SelectItem value="">Dinheiro / PIX</SelectItem>
                    {cards.map(card => (
                      <SelectItem key={card.id} value={card.id.toString()}>{card.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {type === 'expense' && (
            <div className="space-y-2">
              <Label htmlFor="installments">Parcelas (Vezes)</Label>
              <Select value={totalInstallments} onValueChange={(val) => setTotalInstallments(val || "1")}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-white/10">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 24].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className={`w-full h-12 font-bold ${
                type === 'income' 
                  ? 'bg-gradient-to-r from-tertiary to-tertiary/80 text-on-tertiary shadow-[0_4px_15px_rgba(60,221,199,0.3)]' 
                  : 'bg-gradient-to-r from-error to-error/80 text-on-error shadow-[0_4px_15px_rgba(255,180,171,0.2)]'
              }`}
            >
              Confirmar Lançamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
