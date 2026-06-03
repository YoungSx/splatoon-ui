import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import { Heart, Info, MoreHorizontal, Settings, Star, Zap, Skull, Flame } from 'lucide-react'

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-8">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Badge variant="sticker">
            <Zap className="mr-1 h-3 w-3" />
            Component Library
          </Badge>
          <h1 className="splat-skew text-5xl font-black uppercase tracking-wider">
            Splatoon UI
          </h1>
          <p className="max-w-md text-muted-foreground font-medium">
            Scrapbook-inspired component library built on shadcn/ui + Radix
          </p>
        </div>

        {/* Marquee Tape */}
        <Marquee speed={25} variant="tape" className="w-full max-w-4xl">
          <MarqueeItem>Splat Zones</MarqueeItem>
          <MarqueeItem>Tower Control</MarqueeItem>
          <MarqueeItem>Rainmaker</MarqueeItem>
          <MarqueeItem>Clam Blitz</MarqueeItem>
          <MarqueeItem>Turf War</MarqueeItem>
          <MarqueeItem>Salmon Run</MarqueeItem>
        </Marquee>

        <Separator className="max-w-md" />

        <Tabs defaultValue="preview" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Components</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Button</CardTitle>
                  <CardDescription>Tape, solid shadow, color inversion, rotate on hover</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="tape">Tape Style</Button>
                  <Button variant="ghost">Ghost</Button>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badge</CardTitle>
                  <CardDescription>Sticker aesthetic, bold borders</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="sticker">Sticker</Badge>
                </CardContent>
              </Card>

              {/* Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Input</CardTitle>
                  <CardDescription>Bold borders, uppercase placeholder</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Input placeholder="Enter text..." />
                  <Input type="email" placeholder="Email address" disabled />
                </CardContent>
              </Card>

              {/* Switch & Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Switch & Progress</CardTitle>
                  <CardDescription>State controls</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="airplane" />
                    <Label htmlFor="airplane">Airplane Mode</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="dark-mode" defaultChecked />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Progress value={66} className="w-full" />
                </CardContent>
              </Card>

              {/* Alert */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Alert</CardTitle>
                  <CardDescription>Bold border, solid shadow, skewed title</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Notice</AlertTitle>
                    <AlertDescription>
                      This is a default alert with solid border and shadow.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <Skull className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      This is a destructive alert for critical messages.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="warning">
                    <Flame className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      This is a warning alert using the primary brand color.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Default Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Sharp border, solid shadow, skewed title</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Standard card with 2px border and solid offset shadow.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">Action</Button>
                </CardFooter>
              </Card>

              {/* Torn Edge Card */}
              <Card variant="torn">
                <CardHeader>
                  <CardTitle>Torn Paper</CardTitle>
                  <CardDescription>Ripped paper edge effect</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card with torn paper edges using clip-path masks.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="tape">Tape It</Button>
                </CardFooter>
              </Card>

              {/* Tape Card */}
              <Card variant="tape">
                <CardHeader>
                  <CardTitle>Tape Sticker</CardTitle>
                  <CardDescription>Slightly rotated, tape-cut edges</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card styled like a piece of tape stuck on at an angle.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Peel Off</Button>
                </CardFooter>
              </Card>

              {/* Ink Splatter Card */}
              <Card className="ink-splatter md:col-span-2">
                <CardHeader>
                  <CardTitle>Ink Splatter</CardTitle>
                  <CardDescription>Subtle ink overlay on the background</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card with a faint ink splatter effect using radial gradients.
                    Look closely at the edges for the blue and yellow ink spots.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactive" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dialog */}
              <Card>
                <CardHeader>
                  <CardTitle>Dialog</CardTitle>
                  <CardDescription>Scrapbook overlay with solid shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" />}>
                      Open Dialog
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. Continue?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Confirm</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Dropdown Menu */}
              <Card>
                <CardHeader>
                  <CardTitle>Dropdown</CardTitle>
                  <CardDescription>Menu actions with solid border</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Favorite
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" />
                        Like
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              {/* Avatar & Tooltip */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatar & Tooltip</CardTitle>
                  <CardDescription>User info display</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger render={<Avatar className="cursor-pointer" />}>
                      <AvatarFallback>SN</AvatarFallback>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Splatoon User</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold uppercase tracking-wider">Splatoon User</p>
                    <p className="text-xs text-muted-foreground">user@splatoon.dev</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skeleton Loading */}
              <Card>
                <CardHeader>
                  <CardTitle>Skeleton</CardTitle>
                  <CardDescription>Loading state placeholder</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Warning Marquee */}
        <Marquee speed={20} variant="warning" direction="right" className="w-full max-w-4xl">
          <MarqueeItem>Woomy!</MarqueeItem>
          <MarqueeItem>Ngyes!</MarqueeItem>
          <MarqueeItem>Booyah!</MarqueeItem>
          <MarqueeItem>Stay Fresh!</MarqueeItem>
          <MarqueeItem>Splashdown!</MarqueeItem>
        </Marquee>

        <Separator className="max-w-md" />

        <Card variant="tape" className="max-w-md">
          <CardFooter className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
            <span>splatoon-ui v0.1.0</span>
            <span>Next.js + Radix + Tailwind CSS</span>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}
