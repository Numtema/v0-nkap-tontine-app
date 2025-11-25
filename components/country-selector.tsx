"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SUPPORTED_COUNTRIES, type Country } from "@/lib/types"
import { Check, ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CountrySelectorProps {
  value: Country
  onChange: (country: Country) => void
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredCountries = SUPPORTED_COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 rounded-2xl justify-between text-base font-normal"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">{value.flag}</span>
          <span>{value.name}</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un pays..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange(country)
                    setIsOpen(false)
                    setSearch("")
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors"
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1 text-left">{country.name}</span>
                  <span className="text-sm text-muted-foreground">{country.currency}</span>
                  {country.code === value.code && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
