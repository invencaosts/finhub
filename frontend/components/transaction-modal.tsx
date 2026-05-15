import { useState, useEffect } from "react"
import { useFinanceStore, Transaction } from "@/store/use-finance-store"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TransactionModalProps {
  type: 'income' | 'expense'
  children?: React.ReactElement
  initialData?: Transaction
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function TransactionModal({ type, children, initialData, open: externalOpen, onOpenChange }: TransactionModalProps) {
  const { addTransaction, updateTransaction, removeTransaction, cards } = useFinanceStore()
  const { categories, fetchCategories } = useCategoryStore()
  
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen
  
  const [description, setDescription] = useState("")
  const [displayAmount, setDisplayAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [bankName, setBankName] = useState("")
  const [creditCardId, setCreditCardId] = useState<string>("cash")
  const [totalInstallments, setTotalInstallments] = useState("1")
  const [recurrenceMode, setRecurrenceMode] = useState<'fixed' | 'installment'>('installment')
  
  const [showDeleteOptions, setShowDeleteOptions] = useState(false)

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (!cleanValue) return ""
    const numberValue = parseFloat(cleanValue) / 100
    return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setDisplayAmount(formatted)
  }

  useEffect(() => {
    if (open) {
      fetchCategories()
      setShowDeleteOptions(false)
      if (initialData) {
        setDescription(initialData.description)
        const amountValue = initialData.amount as any
        const initialAmount = typeof amountValue === 'number' 
          ? amountValue.toFixed(2).replace('.', ',')
          : amountValue.toString().replace('.', ',')
        setDisplayAmount(initialAmount)
        
        const catName = typeof initialData.category === 'object' 
          ? (initialData.category as any)?.name 
          : initialData.category
        setCategory(catName || "")
        
        setDate(new Date(initialData.date).toISOString().split('T')[0])
        setBankName(initialData.bankName || "")
        setCreditCardId(initialData.creditCardId?.toString() || "cash")
        setTotalInstallments(initialData.totalInstallments?.toString() || "1")
        setRecurrenceMode(initialData.recurrenceMode || (type === 'income' ? 'fixed' : 'installment'))
      } else {
        resetForm()
      }
    }
  }, [open, fetchCategories, initialData, type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numericAmount = parseFloat(displayAmount.replace(/\./g, '').replace(',', '.'))
    
    const data: any = {
      description,
      amount: numericAmount,
      type,
      categoryId: categories.find(c => c.name === category)?.id,
      category: category,
      date,
      bankName: type === 'income' ? bankName : undefined,
      creditCardId: creditCardId && creditCardId !== 'cash' ? parseInt(creditCardId) : undefined,
      totalInstallments: parseInt(totalInstallments),
      recurrenceMode: type === 'income' ? 'fixed' : recurrenceMode
    }

    if (initialData) {
      await updateTransaction(initialData.id, data)
    } else {
      await addTransaction(data)
    }
    
    setOpen(false)
    if (!initialData) resetForm()
  }

  const handleConfirmDelete = async (deleteAll: boolean) => {
    if (initialData) {
      await removeTransaction(initialData.id, deleteAll)
      setOpen(false)
      setShowDeleteOptions(false)
    }
  }

  const resetForm = () => {
    setDescription("")
    setDisplayAmount("")
    setCategory("")
    setDate(new Date().toISOString().split('T')[0])
    setBankName("")
    setCreditCardId("cash")
    setTotalInstallments("1")
    setRecurrenceMode(type === 'income' ? 'fixed' : 'installment')
  }

  const isRecurring = initialData && (initialData.totalInstallments! > 1 || initialData.parentId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="bg-[#122131] border-white/20 text-on-surface sm:max-w-[500px] shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            {showDeleteOptions ? 'Excluir Transação' : initialData ? 'Editar' : 'Adicionar'} {type === 'income' ? 'Renda' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>
        
        {!showDeleteOptions ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Aluguel, Salário, Netflix..." 
                className="input-standard"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input 
                  id="amount" 
                  value={displayAmount}
                  onChange={handleAmountChange}
                  placeholder="0,00" 
                  className="input-standard font-bold text-lg"
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
                  className="input-standard"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={(val) => setCategory(val || "")}>
                  <SelectTrigger className="input-standard h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c2b3c] border-white/20 shadow-2xl">
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
                    className="input-standard"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="card">Pagamento</Label>
                  <Select value={creditCardId} onValueChange={(val) => setCreditCardId(val || "cash")}>
                    <SelectTrigger className="input-standard h-11">
                      <SelectValue placeholder="Dinheiro / PIX" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1c2b3c] border-white/20 shadow-2xl">
                      <SelectItem value="cash">Dinheiro / PIX</SelectItem>
                      {cards.map(card => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                          {card.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t border-white/5 pt-4">
              <div className="flex flex-col gap-3">
                <Label>{type === 'income' ? 'Frequência' : 'Tipo de Lançamento'}</Label>
                <RadioGroup 
                  value={recurrenceMode} 
                  onValueChange={(val: any) => setRecurrenceMode(val)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="installment" id="installment" />
                    <Label htmlFor="installment" className="font-normal cursor-pointer">
                      {type === 'income' ? 'Mensal' : 'Parcelar Valor'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="font-normal cursor-pointer">
                      Repetir Valor Integral
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="installments">Duração (Meses)</Label>
                <Select value={totalInstallments} onValueChange={(val) => setTotalInstallments(val || "1")}>
                  <SelectTrigger className="input-standard h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c2b3c] border-white/20 shadow-2xl">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 24, 36, 48].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n} mês{n > 1 ? 'es' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {parseInt(totalInstallments) > 1 && displayAmount && (
                  <p className="text-[11px] text-tertiary font-bold bg-tertiary/10 p-2 rounded-lg border border-tertiary/20">
                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">info</span>
                    {recurrenceMode === 'fixed' || type === 'income'
                      ? `Serão lançados R$ ${displayAmount} integralmente todos os meses por ${totalInstallments} meses.`
                      : `O valor de R$ ${displayAmount} será dividido em ${totalInstallments} parcelas de R$ ${(parseFloat(displayAmount.replace(/\./g, '').replace(',', '.')) / parseInt(totalInstallments)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    }
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-6 flex flex-row gap-3">
              {initialData && (
                <Button 
                  type="button"
                  onClick={() => isRecurring ? setShowDeleteOptions(true) : handleConfirmDelete(false)}
                  className="flex-1 h-12 font-bold bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20 rounded-xl cursor-pointer"
                >
                  Excluir
                </Button>
              )}
              <Button 
                type="submit" 
                className="flex-1 h-12 font-bold rounded-xl transition-all bg-tertiary text-white hover:bg-tertiary/90 shadow-lg shadow-tertiary/20 cursor-pointer"
              >
                {initialData ? 'Salvar Alterações' : `Confirmar ${type === 'income' ? 'Renda' : 'Despesa'}`}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 space-y-6">
            <p className="text-center text-on-surface/80">
              Esta é uma transação recorrente. Como você deseja excluí-la?
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => handleConfirmDelete(false)}
                className="h-14 font-bold bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-left justify-start px-6 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span>Excluir apenas esta parcela</span>
                  <span className="text-[10px] text-on-surface/40 font-normal">As outras parcelas continuarão existindo.</span>
                </div>
              </Button>
              <Button 
                onClick={() => handleConfirmDelete(true)}
                className="h-14 font-bold bg-error text-white hover:bg-error/90 rounded-xl text-left justify-start px-6 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span>Excluir a série completa</span>
                  <span className="text-[10px] text-white/60 font-normal">Todas as parcelas (futuras e passadas) serão removidas.</span>
                </div>
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setShowDeleteOptions(false)}
                className="h-12 font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
