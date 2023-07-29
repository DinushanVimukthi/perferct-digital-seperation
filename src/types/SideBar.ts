interface SideBarLink {
    name: string;
    icon: any;
    path: string;
    toggle?: boolean;
    subLinks?: SideBarLink[];
}

export type { SideBarLink };