import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const accountSchema = z.object({
  name: z.string().min(2, 'At least 2 characters').max(30, 'Max 30 characters'),
  dob: z.string().optional(),
  language: z.string({ required_error: 'Please select a language.' }),
})

type AccountValues = z.infer<typeof accountSchema>

export function AccountSettingsForm() {
  const [langOpen, setLangOpen] = useState(false)

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '', dob: '', language: 'en' },
  })

  function onSubmit(data: AccountValues) {
    toast.success('Account updated successfully')
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your name' {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input type='date' className='w-[240px]' {...field} />
              </FormControl>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Language</FormLabel>
              <Popover open={langOpen} onOpenChange={setLangOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn('w-[240px] justify-between', !field.value && 'text-muted-foreground')}
                    >
                      {field.value
                        ? LANGUAGES.find((l) => l.value === field.value)?.label
                        : 'Select language'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[240px] p-0'>
                  <Command>
                    <CommandInput placeholder='Search language...' />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {LANGUAGES.map((lang) => (
                          <CommandItem
                            key={lang.value}
                            value={lang.value}
                            onSelect={() => {
                              form.setValue('language', lang.value)
                              setLangOpen(false)
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', field.value === lang.value ? 'opacity-100' : 'opacity-0')} />
                            {lang.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Update account</Button>
      </form>
    </Form>
  )
}
