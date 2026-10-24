<script lang="ts">
	import { page } from '$app/state';
	import { Menu, X, Landmark, Briefcase, LayoutGrid, Search, ArrowRight, ShieldCheck } from 'lucide-svelte';

	let mobileMenuOpen = $state(false);

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	const navLinks = [
		{ href: '/', label: 'Home', icon: LayoutGrid },
		{ href: '/jobs', label: 'All Circulars', icon: Search },
		{ href: '/jobs/government', label: 'Government', icon: Landmark, dot: 'bg-emerald-500' },
		{ href: '/jobs/corporate', label: 'Corporate', icon: Briefcase, dot: 'bg-indigo-500' },
	];

	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-200">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between gap-4">
			<!-- Logo -->
			<a
				href="/"
				class="group flex items-center gap-3 transition-opacity hover:opacity-95"
				onclick={closeMobileMenu}
				aria-label="BD Job Circulars Homepage"
			>
				<div
					class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#075985] text-white shadow-sm ring-1 ring-sky-700/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-md"
				>
					<Landmark size={20} strokeWidth={2.2} />
					<span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
					</span>
				</div>
				<div class="flex flex-col">
					<div class="flex items-center gap-1.5 leading-none">
						<span class="font-heading text-lg font-bold tracking-tight text-slate-900">BD Job</span>
						<span class="font-heading text-lg font-bold tracking-tight text-[#0284C7]">Circulars</span>
					</div>
					<span class="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
						Govt & Corporate Notices
					</span>
				</div>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
				{#each navLinks as link}
					<a
						href={link.href}
						class="relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-150
						{isActive(link.href)
							? 'bg-slate-900 text-white shadow-xs'
							: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
					>
						{#if link.dot}
							<span class="h-2 w-2 rounded-full {link.dot} {isActive(link.href) ? 'ring-2 ring-white/30' : ''}"></span>
						{:else}
							<link.icon size={14} class={isActive(link.href) ? 'text-sky-300' : 'text-slate-400'} />
						{/if}
						<span>{link.label}</span>
					</a>
				{/each}
			</nav>

			<!-- Quick Actions: Live Indicator & Browse Button -->
			<div class="hidden sm:flex items-center gap-3">
				<a
					href="/jobs"
					class="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-slate-800 hover:shadow-sm active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
				>
					<span>Browse Circulars</span>
					<ArrowRight size={13} class="transition-transform duration-150 group-hover:translate-x-0.5" />
				</a>
			</div>

			<!-- Mobile menu toggle button -->
			<button
				class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-[#0284C7] md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-nav"
			>
				{#if mobileMenuOpen}
					<X size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile dropdown navigation -->
	{#if mobileMenuOpen}
		<nav
			id="mobile-nav"
			class="border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 md:hidden shadow-xl animate-in slide-in-from-top-2 duration-150"
			aria-label="Mobile Navigation"
		>
			<div class="flex flex-col gap-1.5">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={closeMobileMenu}
						class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors
						{isActive(link.href)
							? 'bg-slate-900 text-white'
							: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
					>
						<div class="flex items-center gap-3">
							{#if link.dot}
								<span class="h-2.5 w-2.5 rounded-full {link.dot}"></span>
							{:else}
								<link.icon size={16} class={isActive(link.href) ? 'text-sky-300' : 'text-slate-400'} />
							{/if}
							<span>{link.label}</span>
						</div>
						<ArrowRight size={14} class={isActive(link.href) ? 'text-white/60' : 'text-slate-300'} />
					</a>
				{/each}

				<div class="mt-3 pt-3 border-t border-slate-100">
					<a
						href="/jobs"
						onclick={closeMobileMenu}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-[0.98]"
					>
						<Search size={15} />
						Search All Circulars
					</a>
				</div>
			</div>
		</nav>
	{/if}
</header>

