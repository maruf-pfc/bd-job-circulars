<script lang="ts">
	import { Landmark, Mail, ExternalLink, ShieldCheck, FileText } from 'lucide-svelte';
</script>

<footer class="mt-20 border-t border-slate-200 bg-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Brand Info -->
			<div class="lg:col-span-2">
				<a href="/" class="mb-3 flex items-center gap-2.5">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-sm"
					>
						<Landmark size={18} strokeWidth={2.2} />
					</div>
					<span class="font-heading text-lg font-bold tracking-tight text-slate-900">
						BD Job <span class="text-[#0284C7]">Circulars</span>
					</span>
				</a>
				<p class="max-w-md text-xs leading-relaxed text-slate-600">
					Bangladesh's dedicated portal for official government gazettes, BCS announcements, bank recruitments, and verified corporate job circulars. All notice PDFs are provided directly without intermediaries.
				</p>
			</div>

			<!-- Categories -->
			<div>
				<h3 class="font-heading mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">
					Browse Circulars
				</h3>
				<ul class="space-y-2 text-xs">
					<li>
						<a href="/jobs/government" class="text-slate-600 transition-colors hover:text-[#0284C7]">
							Government Jobs (BCS, Ministries)
						</a>
					</li>
					<li>
						<a href="/jobs/corporate" class="text-slate-600 transition-colors hover:text-[#0284C7]">
							Corporate & Bank Vacancies
						</a>
					</li>
					<li>
						<a href="/jobs" class="text-slate-600 transition-colors hover:text-[#0284C7]">
							All Active Circulars
						</a>
					</li>
				</ul>
			</div>

			<!-- Official Portals -->
			<div>
				<h3 class="font-heading mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">
					Official Resources
				</h3>
				<ul class="space-y-2 text-xs">
					<li>
						<a
							href="https://bpsc.gov.bd"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 text-slate-600 transition-colors hover:text-[#0284C7]"
						>
							<span>BPSC Official Portal</span>
							<ExternalLink size={11} class="text-slate-400" />
						</a>
					</li>
					<li>
						<a
							href="http://www.teletalk.com.bd"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 text-slate-600 transition-colors hover:text-[#0284C7]"
						>
							<span>Teletalk Jobs Network</span>
							<ExternalLink size={11} class="text-slate-400" />
						</a>
					</li>
					<li>
						<a
							href="https://erecruitment.bb.org.bd"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 text-slate-600 transition-colors hover:text-[#0284C7]"
						>
							<span>Bangladesh Bank e-Recruitment</span>
							<ExternalLink size={11} class="text-slate-400" />
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Legal Notice & Copyright -->
		<div
			class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row"
		>
			<p>
				&copy; {new Date().getFullYear()} BD Job Circulars. Informational service for Bangladeshi job-seekers.
			</p>
			<p class="flex items-center gap-1 text-[11px] text-slate-400">
				<span>Zero tracker policy • Direct official notices</span>
			</p>
		</div>
	</div>
</footer>
