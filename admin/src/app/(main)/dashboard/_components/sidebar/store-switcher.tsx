"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useStoreModal } from "@/hooks/use-store-modal";
import { cn } from "@/lib/utils";

interface StoreSwitcherProps {
  stores: Array<{ id: string; name: string }>;
}

export function StoreSwitcher({ stores }: StoreSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const storeModal = useStoreModal();
  const { isMobile } = useSidebar();

  const currentStore = stores.find((store) => store.id === params.storeId);

  const onStoreSelect = (storeId: string) => {
    router.push(`/dashboard/store/${storeId}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentStore?.name || "Select Store"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Store
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stores
            </DropdownMenuLabel>
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => onStoreSelect(store.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Store className="size-4 shrink-0" />
                </div>
                {store.name}
                {currentStore?.id === store.id && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => storeModal.onOpen()}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <PlusCircle className="size-4" />
              </div>
              <span className="font-medium text-muted-foreground">
                Create Store
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
