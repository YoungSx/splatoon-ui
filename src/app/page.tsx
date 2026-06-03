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
import { Heart, Info, MoreHorizontal, Settings, Star, Zap } from 'lucide-react'

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="mr-1 h-3 w-3" />
            Component Library
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Splatoon UI</h1>
          <p className="max-w-md text-muted-foreground">
            基于 shadcn/ui + Radix 构建的独特设计语言组件库
          </p>
        </div>

        <Separator className="max-w-md" />

        <Tabs defaultValue="preview" className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">组件预览</TabsTrigger>
            <TabsTrigger value="interactive">交互示例</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>按钮 Button</CardTitle>
                  <CardDescription>多种变体和尺寸</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>徽章 Badge</CardTitle>
                  <CardDescription>状态和标签展示</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </CardContent>
              </Card>

              {/* Input */}
              <Card>
                <CardHeader>
                  <CardTitle>输入框 Input</CardTitle>
                  <CardDescription>表单输入组件</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Input placeholder="请输入内容..." />
                  <Input type="email" placeholder="邮箱地址" disabled />
                </CardContent>
              </Card>

              {/* Switch & Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>开关 & 进度</CardTitle>
                  <CardDescription>状态控制组件</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="airplane" />
                    <Label htmlFor="airplane">飞行模式</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="dark-mode" defaultChecked />
                    <Label htmlFor="dark-mode">深色模式</Label>
                  </div>
                  <Progress value={66} className="w-full" />
                </CardContent>
              </Card>

              {/* Alert */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>提示 Alert</CardTitle>
                  <CardDescription>信息提示组件</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>提示</AlertTitle>
                    <AlertDescription>
                      这是一个信息提示组件，用于展示重要信息。
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactive" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dialog */}
              <Card>
                <CardHeader>
                  <CardTitle>对话框 Dialog</CardTitle>
                  <CardDescription>模态弹窗组件</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" />}>
                      打开对话框
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>确认操作</DialogTitle>
                        <DialogDescription>
                          此操作不可撤销，是否继续？
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">取消</Button>
                        <Button>确认</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Dropdown Menu */}
              <Card>
                <CardHeader>
                  <CardTitle>下拉菜单 Dropdown</CardTitle>
                  <CardDescription>菜单操作组件</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        收藏
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" />
                        点赞
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        设置
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              {/* Avatar & Tooltip */}
              <Card>
                <CardHeader>
                  <CardTitle>头像 & 提示</CardTitle>
                  <CardDescription>用户信息展示</CardDescription>
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
                    <p className="text-sm font-medium">Splatoon User</p>
                    <p className="text-xs text-muted-foreground">user@splatoon.dev</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skeleton Loading */}
              <Card>
                <CardHeader>
                  <CardTitle>骨架屏 Skeleton</CardTitle>
                  <CardDescription>加载状态占位</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
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

        <Separator className="max-w-md" />

        <Card className="max-w-md">
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <span>splatoon-ui v0.1.0</span>
            <span>Next.js + Radix + Tailwind CSS</span>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}
