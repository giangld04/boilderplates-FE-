import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const FONTS = [
  { label: 'Inter', value: 'inter' },
  { label: 'Manrope', value: 'manrope' },
  { label: 'System', value: 'system' },
] as const

const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  font: z.enum(['inter', 'manrope', 'system']),
})

type AppearanceValues = z.infer<typeof appearanceSchema>

/** Theme preview card for light/dark/system radio options */
function ThemeCard({ mode, label }: { mode: string; label: string }) {
  const isDark = mode === 'dark'
  const bg = isDark ? 'bg-zinc-950' : 'bg-white'
  const border = isDark ? 'border-zinc-700' : 'border-zinc-200'
  const cardBg = isDark ? 'bg-zinc-900' : 'bg-zinc-50'
  const lineBg = isDark ? 'bg-zinc-700' : 'bg-zinc-200'
  const accentBg = isDark ? 'bg-zinc-700' : 'bg-zinc-300'
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900'

  return (
    <div className={cn('rounded-md border-2 p-2', border, bg, 'space-y-2')}>
      <div className={cn('rounded-sm border p-2 shadow-sm space-y-2', cardBg, border)}>
        <div className={cn('h-2 w-[80px] rounded-lg', accentBg)} />
        <div className={cn('h-2 w-[100px] rounded-lg', lineBg)} />
        <div className={cn('h-2 w-[60px] rounded-lg', lineBg)} />
      </div>
      <span className={cn('text-xs font-medium', textColor)}>{label}</span>
    </div>
  )
}

export function AppearanceSettingsForm() {
  const { theme: currentTheme, setTheme } = useTheme()

  const form = useForm<AppearanceValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: (currentTheme as AppearanceValues['theme']) ?? 'system',
      font: 'inter',
    },
  })

  function onSubmit(data: AppearanceValues) {
    setTheme(data.theme)
    toast.success('Appearance updated')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='font'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <FormDescription>Set the font you want to use in the dashboard.</FormDescription>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='Select font' />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Theme</FormLabel>
              <FormDescription>Select the theme for the dashboard.</FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='grid grid-cols-3 gap-4 pt-2 max-w-md'
              >
                {([
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ] as const).map(({ value, label }) => (
                  <FormItem key={value}>
                    <FormLabel className='cursor-pointer [&:has([data-state=checked])>div]:border-primary'>
                      <FormControl>
                        <RadioGroupItem value={value} className='sr-only' />
                      </FormControl>
                      <ThemeCard mode={value === 'system' ? 'light' : value} label={label} />
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type='submit'>Update preferences</Button>
      </form>
    </Form>
  )
}
