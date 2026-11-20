"use client";

import Image from "@/components/ui/site-image";
import Link from '@/components/ui/site-link';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { ButtonLink } from '@/components/ui/button-link';
import { IndustryIcon } from '@/components/ui/industry-icon';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { SolutionPillar } from '@/data/enterprise-solutions';
import { industryNavigation } from '@/data/industry-navigation';
import type { IndustryNavigationItem, NavItem, ResourceGroup } from '@/lib/types';
import styles from './mobile-navigation-sheet.module.css';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  navigation: NavItem[];
  categories: SolutionPillar[];
  industries: IndustryNavigationItem[];
  resourceGroups: ResourceGroup[];
  trigger: ReactNode;
};
type View = 'root' | 'solutions' | 'industries' | 'resources';
const titles: Record<View, string> = { root: 'Menu', solutions: 'Solutions', industries: 'Industries', resources: 'Resources' };

function MenuLink({ href, children, overview = false, image }: { href: string; children: ReactNode; overview?: boolean; image?: { src: string } }) {
  return <SheetClose asChild><Link href={href} className={overview ? styles.overview : image ? styles.serviceLink : styles.link}>
    {overview ? <><span>{children}</span>{image && <span className={styles.overviewImage}><Image src={image.src} alt="" fill sizes="180px" className={styles.menuPhoto} /></span>}</> : <>{image && <span className={styles.serviceImage}><Image src={image.src} alt="" fill sizes="56px" className={styles.menuPhoto} /></span>}{children}</>}
  </Link></SheetClose>;
}

export function MobileNavigationSheet({ open, setOpen, navigation, categories, industries, resourceGroups, trigger }: Props) {
  const [view, setView] = useState<View>('root');
  const [expanded, setExpanded] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const rootFocus = useRef<string | null>(null);

  function changeView(next: View) {
    setView(next);
    setExpanded(null);
    requestAnimationFrame(() => {
      scroller.current?.scrollTo({ top: 0 });
      if (next === 'root' && rootFocus.current) {
        scroller.current?.querySelector<HTMLButtonElement>('[data-view="' + rootFocus.current + '"]')?.focus();
      } else heading.current?.focus();
    });
  }
  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) { setView('root'); setExpanded(null); }
  }
  function group(id: string, label: string, children: ReactNode) {
    const active = expanded === id;
    return <div className={styles.group} key={id}>
      <button type="button" className={styles.groupButton} aria-expanded={active} aria-controls={'mobile-group-' + id} onClick={() => {
        setExpanded(active ? null : id);
        requestAnimationFrame(() => {
          const button = document.getElementById('mobile-group-' + id)?.previousElementSibling;
          if (button && scroller.current) {
            const delta = button.getBoundingClientRect().top - scroller.current.getBoundingClientRect().top;
            if (delta < 0) scroller.current.scrollTop += delta;
          }
        });
      }}>{label}<ChevronDown size={17} aria-hidden="true" /></button>
      <div id={'mobile-group-' + id} hidden={!active} className={styles.groupContent}>{active && children}</div>
    </div>;
  }

  return <Sheet open={open} onOpenChange={handleOpenChange}>
    <SheetTrigger asChild>{trigger}</SheetTrigger>
    <SheetContent side="right" showCloseButton={false} aria-describedby={undefined} className="h-dvh max-w-full overflow-hidden border-0 p-0 sm:max-w-[30rem]">
      <SheetTitle className="sr-only">Integrated Solutions Technology navigation</SheetTitle>
      <div className={styles.shell}>
        <div className={styles.header}>
          {view === 'root' ? <Image src="/brand/integrated_solution_technology.png" alt="Integrated Solutions Technology" width={36} height={36} className={styles.logo} /> : <button type="button" className={styles.iconButton} aria-label="Back to main menu" onClick={() => changeView('root')}><ChevronLeft size={21} /></button>}
          <h2 ref={heading} tabIndex={-1} className={styles.title}>{titles[view]}</h2>
          <SheetClose asChild><button type="button" className={styles.iconButton} aria-label="Close menu"><X size={21} /></button></SheetClose>
        </div>
        <div ref={scroller} className={styles.scroll}>
          <nav aria-label={view === 'root' ? 'Mobile main navigation' : titles[view] + ' navigation'} className={styles.content} key={view}>
            {view === 'root' && <>
              {navigation.map(item => {
                const next = ['solutions', 'industries', 'resources'].includes(item.kind ?? '') ? item.kind as View : null;
                return next ? <button type="button" key={item.href} data-view={next} className={styles.rootRow} onClick={() => { rootFocus.current = next; changeView(next); }}>{item.label}<ChevronRight size={17} aria-hidden="true" /></button> : <SheetClose asChild key={item.href}><Link href={item.href} className={styles.rootRow}>{item.label}</Link></SheetClose>;
              })}
              <div className={styles.enquiry}><SheetClose asChild><ButtonLink href="/book-consultation" className="w-full shadow-none">Discuss Your Requirements</ButtonLink></SheetClose></div>
            </>}
            {view === 'solutions' && <>
              <p className={styles.eyebrow}>Services</p>
              {categories.map(category => group('solution-' + category.slug, category.label, <>
                <MenuLink href={category.href} overview image={category.image}>Overview</MenuLink>
                {category.items.map(service => <MenuLink key={service.href} href={service.href} image={service.image}>{service.title}</MenuLink>)}
              </>))}
            </>}
            {view === 'industries' && <>
              <p className={styles.eyebrow}>Who we support</p>
              {industryNavigation.map(item => group('industry-' + item.id, item.label, <>
                {item.entries.map(([slug]) => {
                  const industry = industries.find((entry) => entry.slug === slug);
                  return industry && <MenuLink key={industry.href} href={industry.href}><IndustryIcon name={industry.icon} className={styles.industryIcon} strokeWidth={1.5} /><span>{industry.navLabel}</span></MenuLink>;
                })}
              </>))}
            </>}
            {view === 'resources' && <>
              <p className={styles.eyebrow}>Explore our resources</p>
              <MenuLink href="/resources">View all resources</MenuLink>
              {resourceGroups.map(item => group('resource-' + item.id, item.label, <>{item.links.map(link => <MenuLink key={link.id} href={link.href}>{link.label}</MenuLink>)}</>))}
              <div className="mt-4 rounded-lg bg-brand-navy p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">Have a project?</p>
                <p className="mt-2 font-semibold">Let’s discuss your requirements.</p>
                <SheetClose asChild><Link href="/book-consultation" className="mt-2 inline-flex min-h-11 items-center text-sm underline underline-offset-4">Book a technical consultation</Link></SheetClose>
              </div>
            </>}
          </nav>
        </div>
      </div>
    </SheetContent>
  </Sheet>;
}
