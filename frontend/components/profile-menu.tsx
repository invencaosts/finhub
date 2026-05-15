"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

export function ProfileMenu() {
  const { user, logout, setUser } = useAuthStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [name, setName] = useState(user?.fullName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.put("/auth/profile", {
        fullName: name,
        email,
        password: password || undefined,
      })
      setUser(response.data)
      setIsSettingsOpen(false)
      setPassword("")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-muted border border-border p-0 hover:bg-muted/80">
            <span className="material-symbols-outlined text-foreground">person</span>
          </Button>
        } />
        <DropdownMenuContent className="w-64 bg-popover border-border p-2 rounded-2xl shadow-2xl" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user?.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer hover:bg-muted rounded-xl">
            <span className="material-symbols-outlined mr-2 text-sm">settings</span>
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-error hover:bg-error/10 focus:text-error rounded-xl">
            <span className="material-symbols-outlined mr-2 text-sm">logout</span>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[425px] p-6 rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Meu Perfil</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="input-standard"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="input-standard"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha (deixe em branco para manter)</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="input-standard"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
