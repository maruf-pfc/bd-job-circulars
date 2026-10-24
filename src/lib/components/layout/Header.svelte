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

<header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all">
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
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-sm ring-1 ring-sky-700/20 transition-transform duration-200 group-hover:scale-105"
				>
					<Landmark size={20} strokeWidth={2.2} />
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
			<nav class="hidden md:flex items-center gap-1" aria-label="Main Navigation">
				{#each navLinks as link}
					<a
						href={link.href}
						class="relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150
						{isActive(link.href)
							? 'bg-slate-100 text-slate-900 font-semibold'
							: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
					>
						{#if link.dot}
							<span class="h-2 w-2 rounded-full {link.dot}"></span>
						{:else}
							<link.icon size={15} class={isActive(link.href) ? 'text-[#0284C7]' : 'text-slate-400'} />
						{/if}
						<span>{link.label}</span>
					</a>
				{/each}
			</nav>

			<!-- Quick Search Action -->
			<div class="hidden sm:flex items-center gap-3">
				<a
					href="/jobs"
					class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
				>
					<span>Browse Circulars</span>
					<ArrowRight size={13} />
				</a>
			</div>

			<!-- Mobile menu toggle button -->
			<button
				class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#0284C7] md:hidden"
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
			class="border-t border-slate-200 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-150"
			aria-label="Mobile Navigation"
		>
			<div class="flex flex-col gap-1.5">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={closeMobileMenu}
						class="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors
						{isActive(link.href)
							? 'bg-slate-100 text-slate-900 font-semibold'
							: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
					>
						<div class="flex items-center gap-3">
							{#if link.dot}
								<span class="h-2.5 w-2.5 rounded-full {link.dot}"></span>
							{:else}
								<link.icon size={17} class="text-slate-400" />
							{/if}
							<span>{link.label}</span>
						</div>
						<ArrowRight size={14} class="text-slate-300" />
					</a>
				{/each}

				<div class="mt-3 pt-3 border-t border-slate-100">
					<a
						href="/jobs"
						onclick={closeMobileMenu}
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
					>
						<Search size={15} />
						Search All Circulars
					</a>
				</div>
			</div>
		</nav>
	{/if}
</header>
