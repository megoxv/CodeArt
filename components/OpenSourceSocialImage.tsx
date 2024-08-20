'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

const backgroundOptions = [
    { name: "Topography", url: "https://i.ibb.co/Gdcn3WD/topography.png" },
    { name: "Topography 2", url: "https://www.toptal.com/designers/subtlepatterns/uploads/topography.png" },
    { name: "Hexagons", url: "https://www.toptal.com/designers/subtlepatterns/uploads/hexellence.png" },
]

const iconOptions = [
    { name: "Package", url: "https://cdn-icons-png.flaticon.com/512/3524/3524335.png" },
    { name: "Code", url: "https://cdn-icons-png.flaticon.com/512/3524/3524344.png" },
    { name: "Gear", url: "https://cdn-icons-png.flaticon.com/512/3524/3524636.png" },
]

export default function Component() {
    const [width, setWidth] = useState(1200)
    const [height, setHeight] = useState(630)
    const [fileType, setFileType] = useState("png")
    const [fontSize, setFontSize] = useState(100)
    const [packageName, setPackageName] = useState("awesome-package")
    const [packageDescription, setPackageDescription] = useState("Manage awesome features with customizable options")
    const [packageManager, setPackageManager] = useState("npm")
    const [backgroundType, setBackgroundType] = useState("predefined")
    const [predefinedBackground, setPredefinedBackground] = useState(backgroundOptions[0].url)
    const [urlBackground, setUrlBackground] = useState("")
    const [uploadedBackground, setUploadedBackground] = useState<string | null>(null)
    const [iconType, setIconType] = useState("predefined")
    const [predefinedIcon, setPredefinedIcon] = useState(iconOptions[0].url)
    const [urlIcon, setUrlIcon] = useState("")
    const [uploadedIcon, setUploadedIcon] = useState<string | null>(null)
    const [showIcon, setShowIcon] = useState(true)
    const [iconSize, setIconSize] = useState(100)
    const [iconPosition, setIconPosition] = useState("top-center")
    const [textColor, setTextColor] = useState("#ffffff")
    const [bgColor, setBgColor] = useState("#1a202c")
    const [installBgColor, setInstallBgColor] = useState("rgba(45, 55, 72, 0.8)")
    const [backgroundOpacity, setBackgroundOpacity] = useState(1)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const bgFileInputRef = useRef<HTMLInputElement>(null)
    const iconFileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        renderCanvas()
    }, [width, height, fontSize, packageName, packageDescription, packageManager, backgroundType, predefinedBackground, urlBackground, uploadedBackground, iconType, predefinedIcon, urlIcon, uploadedIcon, showIcon, iconSize, iconPosition, textColor, bgColor, installBgColor, backgroundOpacity])

    const renderCanvas = async () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = width
        canvas.height = height

        // Background Color
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Background Image
        try {
            const bgImg = await loadImage(getBackgroundImage())
            ctx.globalAlpha = backgroundOpacity
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = 1
        } catch (error) {
            console.error("Error loading background image:", error)
        }

        // Icon
        if (showIcon) {
            try {
                const iconImg = await loadImage(getIconImage())
                const iconX = getIconX(iconPosition, iconSize, canvas.width)
                const iconY = getIconY(iconPosition, iconSize, canvas.height)
                ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize)
            } catch (error) {
                console.error("Error loading icon image:", error)
            }
        }

        // Package Name
        ctx.fillStyle = textColor
        ctx.font = `bold ${fontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.fillText(packageName, canvas.width / 2, canvas.height / 2 - 50)

        // Package Description
        ctx.font = '24px Arial'
        ctx.fillText(packageDescription, canvas.width / 2, canvas.height / 2 + 50)

        // Install Command
        const installCommand = getInstallCommand(packageManager, packageName)
        const installWidth = Math.min(500, canvas.width - 40)
        const installHeight = 50
        const installX = (canvas.width - installWidth) / 2
        const installY = canvas.height - installHeight - 25

        ctx.fillStyle = installBgColor
        ctx.fillRect(installX, installY, installWidth, installHeight)
        ctx.fillStyle = textColor
        ctx.font = '20px monospace'
        ctx.fillText(installCommand, canvas.width / 2, installY + 32)
    }

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    }

    const getIconX = (position: string, size: number, canvasWidth: number): number => {
        if (position.includes('left')) return 50
        if (position.includes('right')) return canvasWidth - size - 50
        return (canvasWidth - size) / 2
    }

    const getIconY = (position: string, size: number, canvasHeight: number): number => {
        if (position.includes('top')) return 50
        if (position.includes('bottom')) return canvasHeight - size - 50
        return (canvasHeight - size) / 2
    }

    const getBackgroundImage = () => {
        switch (backgroundType) {
            case 'predefined':
                return predefinedBackground
            case 'url':
                return urlBackground
            case 'upload':
                return uploadedBackground || ''
            default:
                return predefinedBackground
        }
    }

    const getIconImage = () => {
        switch (iconType) {
            case 'predefined':
                return predefinedIcon
            case 'url':
                return urlIcon
            case 'upload':
                return uploadedIcon || ''
            default:
                return predefinedIcon
        }
    }

    const getInstallCommand = (manager: string, name: string) => {
        switch (manager) {
            case 'npm':
                return `npm install ${name}`
            case 'yarn':
                return `yarn add ${name}`
            case 'pnpm':
                return `pnpm add ${name}`
            case 'composer':
                return `composer require ${name}`
            case 'pip':
                return `pip install ${name}`
            case 'gem':
                return `gem install ${name}`
            default:
                return `${manager} install ${name}`
        }
    }

    const handleDownload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const dataUrl = canvas.toDataURL(`image/${fileType}`)
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `${packageName}-social-image.${fileType}`
        link.click()
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setFunction: (value: string | null) => void) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFunction(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Social Images for Open Source Packages</h2>

            <div className="text-center text-sm text-gray-600 mb-6">
                Create beautiful social images for your awesome Open Source package!
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Tabs defaultValue="general">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="background">Background</TabsTrigger>
                            <TabsTrigger value="icon">Icon</TabsTrigger>
                            <TabsTrigger value="colors">Colors</TabsTrigger>
                            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fileType">File Type</Label>
                                    <Select value={fileType} onValueChange={setFileType}>
                                        <SelectTrigger id="fileType">
                                            <SelectValue placeholder="Select file type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="png">PNG</SelectItem>
                                            <SelectItem value="jpeg">JPG</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
                                <Slider
                                    id="fontSize"
                                    min={40}
                                    max={200}
                                    step={1}
                                    value={[fontSize]}
                                    onValueChange={(value) => setFontSize(value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="packageName">Package Name</Label>
                                <Input
                                    id="packageName"
                                    value={packageName}
                                    onChange={(e) => setPackageName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="packageDescription">Short Description</Label>
                                <Textarea
                                    id="packageDescription"
                                    value={packageDescription}
                                    onChange={(e) => setPackageDescription(e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="packageManager">Package Manager</Label>
                                <Select value={packageManager} onValueChange={setPackageManager}>
                                    <SelectTrigger id="packageManager">
                                        <SelectValue placeholder="Select package manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="npm">npm</SelectItem>
                                        <SelectItem value="yarn">Yarn</SelectItem>
                                        <SelectItem value="pnpm">pnpm</SelectItem>
                                        <SelectItem value="composer">Composer</SelectItem>
                                        <SelectItem value="pip">pip</SelectItem>
                                        <SelectItem value="gem">gem</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                        <TabsContent value="background" className="space-y-4">
                            <RadioGroup value={backgroundType} onValueChange={setBackgroundType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="predefined" id="bg-predefined" />
                                    <Label htmlFor="bg-predefined">Predefined</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="url" id="bg-url" />
                                    <Label htmlFor="bg-url">URL</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="upload" id="bg-upload" />
                                    <Label htmlFor="bg-upload">Upload</Label>
                                </div>
                            </RadioGroup>

                            {backgroundType === 'predefined' && (
                                <div className="space-y-2">
                                    <Label htmlFor="predefinedBackground">Predefined Background</Label>
                                    <Select value={predefinedBackground} onValueChange={setPredefinedBackground}>
                                        <SelectTrigger id="predefinedBackground">
                                            <SelectValue placeholder="Select background" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {backgroundOptions.map((bg) => (
                                                <SelectItem key={bg.name} value={bg.url}>{bg.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {backgroundType === 'url' && (
                                <div className="space-y-2">
                                    <Label htmlFor="urlBackground">Background URL</Label>
                                    <Input
                                        id="urlBackground"
                                        value={urlBackground}
                                        onChange={(e) => setUrlBackground(e.target.value)}
                                        placeholder="https://example.com/background.jpg"
                                    />
                                </div>
                            )}

                            {backgroundType === 'upload' && (
                                <div className="space-y-2">
                                    <Label htmlFor="uploadBackground">Upload Background</Label>
                                    <Input
                                        id="uploadBackground"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, setUploadedBackground)}
                                        ref={bgFileInputRef}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="backgroundOpacity">Background Opacity: {backgroundOpacity}</Label>
                                <Slider
                                    id="backgroundOpacity"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={[backgroundOpacity]}
                                    onValueChange={(value) => setBackgroundOpacity(value[0])}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="icon" className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={showIcon}
                                    onCheckedChange={setShowIcon}
                                    id="show-icon"
                                />
                                <Label htmlFor="show-icon">Show Icon</Label>
                            </div>

                            {showIcon && (
                                <>
                                    <RadioGroup value={iconType} onValueChange={setIconType}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="predefined" id="icon-predefined" />
                                            <Label htmlFor="icon-predefined">Predefined</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="url" id="icon-url" />
                                            <Label htmlFor="icon-url">URL</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="upload" id="icon-upload" />
                                            <Label htmlFor="icon-upload">Upload</Label>
                                        </div>
                                    </RadioGroup>

                                    {iconType === 'predefined' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="predefinedIcon">Predefined Icon</Label>
                                            <Select value={predefinedIcon} onValueChange={setPredefinedIcon}>
                                                <SelectTrigger id="predefinedIcon">
                                                    <SelectValue placeholder="Select icon" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {iconOptions.map((icon) => (
                                                        <SelectItem key={icon.name} value={icon.url}>{icon.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {iconType === 'url' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="urlIcon">Icon URL</Label>
                                            <Input
                                                id="urlIcon"
                                                value={urlIcon}
                                                onChange={(e) => setUrlIcon(e.target.value)}
                                                placeholder="https://example.com/icon.png"
                                            />
                                        </div>
                                    )}

                                    {iconType === 'upload' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="uploadIcon">Upload Icon</Label>
                                            <Input
                                                id="uploadIcon"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, setUploadedIcon)}
                                                ref={iconFileInputRef}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="iconSize">Icon Size: {iconSize}px</Label>
                                        <Slider
                                            id="iconSize"
                                            min={50}
                                            max={200}
                                            step={1}
                                            value={[iconSize]}
                                            onValueChange={(value) => setIconSize(value[0])}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="iconPosition">Icon Position</Label>
                                        <Select value={iconPosition} onValueChange={setIconPosition}>
                                            <SelectTrigger id="iconPosition">
                                                <SelectValue placeholder="Select position" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="top-center">Top Center</SelectItem>
                                                <SelectItem value="top-left">Top Left</SelectItem>
                                                <SelectItem value="top-right">Top Right</SelectItem>
                                                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                                <SelectItem value="center">Center</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                        <TabsContent value="colors" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="textColor">Text Color</Label>
                                <Input
                                    id="textColor"
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bgColor">Background Color</Label>
                                <Input
                                    id="bgColor"
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="installBgColor">Install Background Color</Label>
                                <Input
                                    id="installBgColor"
                                    type="color"
                                    value={installBgColor}
                                    onChange={(e) => setInstallBgColor(e.target.value)}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="dimensions" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="width">Width (px)</Label>
                                <Input
                                    id="width"
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(Number(e.target.value))}
                                    min={200}
                                    max={2000}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (px)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    min={200}
                                    max={2000}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Button onClick={handleDownload} className="w-full">
                        Download Image
                    </Button>
                </div>

                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-auto border border-gray-300 rounded-lg shadow-lg"
                        style={{ aspectRatio: `${width} / ${height}` }}
                    />
                </div>
            </div>
        </div>
    )
}