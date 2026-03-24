import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CaretRightIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  InfoIcon,
} from "@phosphor-icons/react";

const colors = [
  { name: "Beige 500", var: "var(--color-beige-500)", hex: "#98908b" },
  { name: "Beige 100", var: "var(--color-beige-100)", hex: "#f8f4f0" },
  { name: "Grey 900", var: "var(--color-grey-900)", hex: "#201f24" },
  { name: "Grey 500", var: "var(--color-grey-500)", hex: "#696868" },
  { name: "Grey 300", var: "var(--color-grey-300)", hex: "#b3b3b3" },
  { name: "Grey 100", var: "var(--color-grey-100)", hex: "#f2f2f2" },
  { name: "Green", var: "var(--color-green)", hex: "#277c78" },
  { name: "Yellow", var: "var(--color-yellow)", hex: "#f2cdac" },
  { name: "Cyan", var: "var(--color-cyan)", hex: "#82c9d7" },
  { name: "Navy", var: "var(--color-navy)", hex: "#626070" },
  { name: "Red", var: "var(--color-red)", hex: "#c94736" },
  { name: "Purple", var: "var(--color-purple)", hex: "#826cb0" },
];

export default function DesignSystemPage() {
  return (
    <div className="bg-beige-100 min-h-screen space-y-16 p-8 md:p-12">
      <div>
        <h1 className="text-grey-900 mb-8 text-3xl font-bold">Design System</h1>
      </div>

      {/* Colors Section */}
      <section>
        <h2 className="text-grey-900 mb-6 text-xl font-bold">Colors</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
          {colors.map((color) => (
            <div key={color.name} className="flex flex-col gap-2">
              <div
                className="border-grey-100 h-24 w-full rounded-lg border shadow-sm"
                style={{ backgroundColor: color.var }}
              />
              <div className="flex flex-col">
                <span className="text-grey-900 text-sm font-bold">
                  {color.name}
                </span>
                <span className="text-grey-500 text-xs">{color.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section>
        <h2 className="text-grey-900 mb-6 text-xl font-bold">Typography</h2>
        <div className="space-y-6 rounded-xl bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Heading 1 (Text XL)</h1>
            <p className="text-grey-500 text-sm">Public Sans Bold - 32px</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold">Heading 2 (Text LG)</h2>
            <p className="text-grey-500 text-sm">Public Sans Bold - 20px</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-md font-bold">Heading 3 (Text MD)</h3>
            <p className="text-grey-500 text-sm">Public Sans Bold - 16px</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Body Text (Text SM)</p>
            <p className="text-grey-500 text-sm">Public Sans Regular - 14px</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">Caption / Small Text (Text XS)</p>
            <p className="text-grey-500 text-sm">Public Sans Regular - 12px</p>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section>
        <h2 className="text-grey-900 mb-6 text-xl font-bold">Buttons</h2>
        <div className="flex flex-wrap items-start gap-8 rounded-xl bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-grey-500 mb-2 text-sm font-bold">Primary</h3>
            <Button variant="primary">Default Button</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-grey-500 mb-2 text-sm font-bold">Secondary</h3>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-grey-500 mb-2 text-sm font-bold">Tertiary</h3>
            <Button variant="tertiary" size="text">
              See Details
              <CaretRightIcon weight="fill" />
            </Button>
            <Button variant="tertiary" size="text" disabled>
              Disabled
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-grey-500 mb-2 text-sm font-bold">Destroy</h3>
            <Button variant="destroy">Delete Account</Button>
            <Button variant="destroy" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </section>

      {/* Form Elements Section */}
      <section>
        <h2 className="text-grey-900 mb-6 text-xl font-bold">Form Elements</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-sm">
            <h3 className="mb-4 font-bold">Inputs</h3>

            <div className="space-y-2">
              <Label className="text-xs">Default Input</Label>
              <Input placeholder="Enter text here..." />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">With Error</Label>
              <Input
                placeholder="Invalid input"
                aria-invalid={true}
                className="border-red"
              />
            </div>
          </div>

          {/* Selects */}
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-sm">
            <h3 className="mb-4 font-bold">Selects</h3>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs">
                Default Select
              </Label>
              <Select>
                <SelectTrigger className="w-full" id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="dining">Dining Out</SelectItem>
                    <SelectItem value="transportation">
                      Transportation
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Compact Select</Label>
              <Select>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Input Groups */}
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-sm md:col-span-2">
            <h3 className="mb-4 font-bold">Input Groups</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Search Input</Label>
                <InputGroup>
                  <InputGroupInput placeholder="Search transactions..." />
                  <InputGroupAddon align="inline-end">
                    <MagnifyingGlassIcon size={16} weight="bold" />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Currency Input</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <CurrencyDollarIcon
                      size={16}
                      weight="bold"
                      className="text-beige-500"
                    />
                  </InputGroupAddon>
                  <InputGroupInput placeholder="0.00" type="number" />
                </InputGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">With Button</Label>
                <InputGroup>
                  <InputGroupInput placeholder="Recipient email" />
                  <InputGroupButton>Send</InputGroupButton>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tooltips Section */}
      <section className="pb-20">
        <h2 className="text-grey-900 mb-6 text-xl font-bold">Tooltips</h2>
        <div className="flex gap-8 rounded-xl bg-white p-8 shadow-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover Me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip!</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="primary"
                  className="flex h-12 w-12 items-center justify-center rounded-full p-0"
                >
                  <InfoIcon weight="fill" size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Info Tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
    </div>
  );
}
