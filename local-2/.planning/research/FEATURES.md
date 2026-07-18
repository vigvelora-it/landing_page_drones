# Feature Research

**Domain:** Premium corporate/technical website for a geospatial-engineering consulting firm (topography/drones, geotechnical, mining, civil works) — Fugro/Seequent-tier positioning
**Researched:** 2026-07-18
**Confidence:** MEDIUM (cross-verified across Fugro, Seequent, Trimble Geospatial, WSP, Tetra Tech, SRK Consulting via built-in WebSearch/WebFetch; no premium docs/API providers configured for this run, so treat as MEDIUM not HIGH — see Sources)

## Feature Landscape

### Table Stakes (Users Expect These)

Features a B2B geospatial/engineering-consulting site is assumed to have. Missing these makes SkyTech look like a small operator, not a peer to Fugro/Seequent-tier firms.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Services organized as a browsable grid/list with per-service summary card | Every reference site (Fugro `/expertise`, Trimble, Seequent, WSP) presents services as scannable cards, not paragraphs of prose | MEDIUM | Maps directly to `capabilities-section.tsx` (existing) — restyle as light card grid, 5 "ejes" instead of generic capability bullets |
| Service detail accessible without full page navigation (drawer/panel) | Client brief explicitly requests this pattern; drawers are an established "primary-detail" UI pattern (overlay/push/persistent variants) used for exactly this: show detail without losing place in the service list | MEDIUM-HIGH | New component. Needs `prefers-reduced-motion`-gated open/close animation reusing existing GSAP/Lenis setup; must work with existing `menu-overlay.tsx` z-index stack without conflict |
| Team/expert profiles with photo + name + title + credentials | Reference firms (SRK, Fugro, WSP) all surface named experts with headshots and qualifications as a trust signal; client has 4 named geologist-founders with bios already written | LOW-MEDIUM | New `team-section.tsx`. Client already provided the 4 bios — this is a content-placement task, not a content-creation task |
| Real project case studies (client, location, service, deliverable) | Table stakes across every geospatial competitor reviewed (Fugro links case studies from expertise pages; Trimble features flagship customer stories; Axim Geospatial, Glanville Geospatial both run dedicated case-study sections) | MEDIUM | Client supplied 3 real projects (GESAC/Huarmey, Lezard/Huaral, Las Dunas/Piura) — only "Levantamiento Aerofotogramétrico" so far, meaning the section must read well even with a short project list (design for 3, extensible to more) |
| Sticky/fixed header navigation | Confirmed pattern on every reference site reviewed (Seequent, Fugro, Trimble); client brief explicitly requests it | LOW | Already exists per PROJECT.md ("encabezado fijo" listed as existing/target) — extend existing header, don't rebuild |
| Light, low-saturation color scheme (white/light-gray base, restrained accent color) | Fugro and Seequent both run white/light-gray backgrounds with dark text and a single restrained accent (blue/teal); this is the explicit brand direction in the brief | LOW | This is a CSS variable / theme swap, not new component work — but touches every existing section |
| Contact section with links (WhatsApp, email, social) | Already exists (`contact-section.tsx` + `/api/contact` + Supabase) — must be preserved, not rebuilt, per constraints | LOW | No new work; verify visual restyle doesn't break the form flow |
| Mobile-responsive drawer/menu behavior | All reference patterns (Fugro, Seequent mega menus; drawer UX pattern) must degrade gracefully to mobile; drawers commonly become full-screen overlay on small viewports | MEDIUM | Applies to both the existing `menu-overlay.tsx` and the new service drawer — two drawer-like patterns need a consistent mobile interaction model to avoid confusing UX |

### Differentiators (Competitive Advantage)

Features that align with SkyTech's stated real differentiator ("4 geólogos + tecnología de vanguardia, no solo datos sino análisis y recomendaciones") and separate it from the drone-services-only local competitors named in the brief (ARQUIDRON, JE & WJ, GeoXPert, Norte Urbano).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Competitive-differentiation section built on data-backed claims + real project evidence, never naming competitors on-page | B2B best practice confirmed across sources: effective differentiation leads with specific numbers/case-study outcomes, not generic "why choose us" claims; naming competitors directly reads as defensive/small-time, and the brief lists competitor names only as internal research context, not copy | MEDIUM | Content should reframe the 4 competitors' likely gap (drone-only, no in-house geologists) as SkyTech's strength ("análisis y recomendaciones, no solo datos") without naming them; pairs with team section as proof |
| Equipment/drone/camera carousel with premium, restrained treatment | Requested explicitly in brief; industrial/technical brands (vs. consumer/toy brands) use high-contrast photography on clean backgrounds and smooth (non-flashy) transitions — signals precision instrument quality, not a toy-drone shop | MEDIUM | Needs real equipment photography (client-provided or licensed) — do not use generic stock drone photography or the site reads as "drone-only," which the brief explicitly vetoes |
| Downloadable brand/services brochure (PDF) | Requested in brief; standard corporate lead-capture pattern; client stated SEO/presentation is the goal over direct quote capture, so this likely should be an ungated direct download rather than a lead-gated form, keeping friction low | LOW-MEDIUM | Requires brochure PDF content (likely repurposes mission/vision/services/team copy already written) — decide gated vs. ungated with the user; default recommendation: ungated, since brief says quote capture isn't the priority |
| Flagship/featured project treatment (1 highlighted case study, not just a grid) | Trimble's pattern of surfacing one flagship customer story on the homepage, with a fuller case-study list elsewhere, reads stronger with only 3 available projects than a sparse-looking grid | LOW | With only 3 real projects, a "featured + list" layout looks more intentional than a 3-item grid that visually implies "we ran out of content" |
| Mission/vision/values/history section woven with imagery of geology, mining, and civil-works work (not drone footage) | Brief explicitly vetoes drone-only imagery; differentiator is showing the full breadth (geotechnical fieldwork, mining sites, civil infrastructure) that competitors (drone-only shops) can't show | MEDIUM | Depends on client supplying non-drone photography — flag as a content/asset gap early, since this is a photography sourcing problem, not a code problem |

### Anti-Features (Explicitly Vetoed by Client Brief — Do Not Build)

These are patterns that might seem "modern" or "engaging" but are explicitly out of scope per the client's visual-identity brief (PROJECT.md Context section) and confirmed by research as inappropriate for this genre.

| Feature | Why It Might Seem Appealing | Why Problematic (per brief + research) | Alternative |
|---------|---------------------------|----------------------------------------|-------------|
| Dark, heavy-effect cinematic backgrounds (the prior Dogstudio direction) | Visually dramatic, was the milestone-1 default, "premium tech" feels achievable via dark UI + glow effects | Explicitly vetoed in brief ("fondos oscuros con exceso de efectos"); reference firms (Fugro, Seequent) all run light backgrounds — dark cinematic reads as agency/creative-studio, not engineering-firm | Light background (white/light-gray), restrained motion, confirmed as the correct direction for this genre |
| Loud/saturated accent colors (phosphorescent green, intense red, bright yellow) | Draws attention, common in startup/marketing sites for CTAs | Explicitly vetoed in brief; every reference site uses a single restrained accent (blue/teal) against neutral base | One muted brand accent color (blue-gray/teal family), used sparingly for CTAs/interactive states only |
| Cartoonish/"startup" iconography (flat mascot-style illustrations) | Approachable, cheap to produce, common in SaaS landing pages | Explicitly vetoed in brief; research confirms cartoon/mascot elements "cost enterprise deals" — B2B decision-makers read them as immature/unable to handle complex work | Real photography (people, equipment, sites) and precise line-based technical iconography if icons are needed at all |
| Drone-only imagery throughout the site | Drones are visually dynamic and the company's original product-market entry point | Explicitly vetoed in brief — SkyTech's differentiator is geology + engineering breadth, not drones alone; drone-only imagery makes it indistinguishable from the named drone-only competitors (ARQUIDRON, JE & WJ, GeoXPert, Norte Urbano) | Imagery mix spanning geotechnical fieldwork, mining-site work, civil/road infrastructure, and the 4 geologists in the field — drones as one eje among five, not the visual identity |
| Heavy/dramatic scroll-jacking or intense parallax/WebGL effects | Reads as cutting-edge, matches "tech company" aspirations | Brief specifies "nivel de animación Moderado" and explicitly rules out the prior cinematic direction; WebGL/shaders already ruled out in PROJECT.md Out of Scope for risk reasons | Reuse existing Lenis+GSAP engine for subtle scroll-reveal and section transitions only — moderate, not showcase-driven motion |
| Gated brochure download with mandatory lead-capture form | Common B2B lead-gen pattern, "feels" more sophisticated | Client explicitly said SEO/presentation is the goal, not quote capture — adding friction here works against the client's stated priority and adds unnecessary form/backend complexity | Direct PDF download link (ungated), or at most an optional email field that doesn't block the download |
| Naming competitors directly on-page in the differentiation section | Direct comparison feels persuasive and concrete | Reads as defensive/small-time for a premium-positioned firm; not how any reference site (Fugro, Seequent, WSP, Tetra Tech) frames differentiation — none name competitors publicly | Data-backed, evidence-driven differentiation (real projects, named experts, specific technical capability) without naming ARQUIDRON/JE & WJ/GeoXPert/Norte Urbano in visible copy |
| Dense mega-menu with every sub-service as a separate top-level nav item | Feels "complete," mirrors some enterprise sites with huge catalogs | Best practice caps top-level nav at ~5 items to avoid truncation/overload; SkyTech has exactly 5 ejes, which maps cleanly — going deeper (sub-service items in nav) adds noise without benefit at this catalog size | Use the drawer pattern for eje-level depth instead of expanding the top nav; keep nav to the 5 ejes + core pages (About, Team, Projects, Contact) |

## Feature Dependencies

```
Light theme / color system (CSS variable swap)
    └──required by──> Every restyled section (hero, manifesto, capabilities, technology, process, contact)

Capabilities-section restructure (5 ejes as cards)
    └──requires──> Light theme / color system
    └──enables──> Service detail drawer (drawer opens FROM the eje cards)

Service detail drawer
    └──requires──> Capabilities-section restructure (needs eje cards as trigger)
    └──requires──> Existing Lenis+GSAP engine (for open/close animation, reduced-motion gating)
    └──shares interaction surface with──> menu-overlay.tsx (both are overlay/drawer patterns — must not conflict in z-index or scroll-lock behavior)

Team section (4 geologists)
    └──enhances──> Competitive-differentiation section (team = proof of the "4 geólogos" claim)
    └──independent of──> Projects showcase (can ship in either order)

Projects showcase (3 real projects)
    └──enhances──> Competitive-differentiation section (projects = proof of delivery)
    └──requires──> Client-supplied project imagery (non-drone-only) — asset dependency, not code dependency

Competitive-differentiation section
    └──requires──> Team section (for credibility proof points)
    └──requires──> Projects showcase (for evidence-based claims)
    └──conflicts with──> Naming competitors directly (anti-feature — do not combine)

Equipment/drone/camera carousel
    └──requires──> Client-supplied equipment photography (non-generic-stock)
    └──independent of──> Team section, Projects showcase (can ship separately)

Downloadable brochure
    └──requires──> Team section + Mission/vision/values content (brochure content is largely a repackaging of these)
    └──conflicts with──> Gated lead-capture form (anti-feature per client's stated priority — do not combine unless client reverses that priority)

Mission/vision/values/history content
    └──requires──> Light theme / color system
    └──enhances──> Competitive-differentiation section (brand narrative backs up the claims)
```

### Dependency Notes

- **Service detail drawer requires the capabilities-section restructure:** the drawer needs a trigger surface (the eje cards); building the drawer before restructuring capabilities-section into 5 discrete eje cards has nothing to attach to.
- **Service detail drawer shares interaction surface with `menu-overlay.tsx`:** both are full/partial-screen overlay patterns built on the same Lenis+GSAP scroll-lock mechanics. They must be planned together (or at least audited together) to avoid two competing overlay/scroll-lock implementations — a likely pitfall if built independently in different phases.
- **Competitive-differentiation section requires both Team and Projects:** per research, effective B2B differentiation is evidence-based (named experts + real project outcomes), not claims-based. Building the differentiation section before team/projects content exists would force it back to generic "why choose us" copy, which research flags as the most common failure mode to avoid.
- **Equipment carousel and Projects showcase both have a photography-asset dependency, not a code dependency:** flag early with the user/client — if non-drone, non-generic-stock photography isn't available, this becomes a content-sourcing blocker, not an engineering one.
- **Downloadable brochure conflicts with gated lead-capture form:** these are two different implementations of "get the brochure." Pick one per the client's stated goal (presentation/SEO, not quote capture) — recommend ungated.
- **Light theme / color system is a prerequisite for every other visual feature:** since this milestone's core mandate is replacing the dark cinematic theme, sequencing the color-system foundation before section-level rebuilds avoids restyling sections twice.

## MVP Definition

### Launch With (v1 — this milestone)

Everything the client's brief and PROJECT.md target list explicitly calls for. Not optional for this milestone.

- [ ] Light theme / color system (gray-on-top + white-below, restrained accent) — foundation for everything else
- [ ] 5 ejes restructured as browsable service cards (Topografía/Drones, Geotecnia, Minería, Obras Civiles, Servicios Complementarios)
- [ ] Service detail side-drawer (per eje) — explicit client interaction-pattern request
- [ ] Team section — 4 geologist profiles with photo/bio (content already written by client)
- [ ] Projects showcase — 3 real projects (GESAC, Lezard, Las Dunas) with client/location/service/deliverable
- [ ] Competitive-differentiation section — evidence-based, no competitor names in visible copy
- [ ] Equipment/drone/camera carousel
- [ ] Downloadable brochure (recommend ungated PDF)
- [ ] Fixed/sticky header (extend existing)
- [ ] Preserve existing contact form + Supabase integration unchanged in function

### Add After Validation (v1.x)

Not required for this milestone's launch, but natural next steps if the client wants more depth once the core relaunch is live.

- [ ] Expand projects showcase beyond the 3 initial projects as new work is delivered — trigger: client signs new projects and wants them added
- [ ] Optional lead-capture variant of the brochure download (if client later prioritizes quote capture over pure SEO/presentation) — trigger: client changes stated goal
- [ ] Deeper per-eje sub-pages (beyond drawer summary) if any single eje's content outgrows what a drawer can hold — trigger: client provides substantially more detail per eje than fits a drawer panel

### Future Consideration (v2+)

Defer until the core relaunch has been live and validated with the client/market.

- [ ] Multi-language support (site currently implied Spanish-only; client's social presence is Peru-local) — defer until there's a stated need for international/English content
- [ ] Interactive project map (plotting real projects by region — Piura, Tambogrande, Casma, Huarmey, Huaral, Barranca, Lima) — nice enhancement to the projects showcase but not required for launch; adds mapping-library complexity better evaluated once the base showcase ships
- [ ] Case-study detail pages per project (vs. summary cards) — defer until there are enough projects (5+) to justify dedicated pages beyond the current 3

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Light theme / color system | HIGH | MEDIUM | P1 |
| 5 ejes as service cards | HIGH | MEDIUM | P1 |
| Service detail drawer | HIGH | MEDIUM-HIGH | P1 |
| Team section (4 geologists) | HIGH | LOW-MEDIUM | P1 |
| Projects showcase (3 projects) | HIGH | MEDIUM | P1 |
| Competitive-differentiation section | MEDIUM-HIGH | MEDIUM | P1 |
| Equipment/drone/camera carousel | MEDIUM | MEDIUM | P1 |
| Downloadable brochure | MEDIUM | LOW-MEDIUM | P1 |
| Fixed/sticky header extension | MEDIUM | LOW | P1 |
| Expand projects beyond initial 3 | MEDIUM | LOW (incremental) | P2 |
| Gated lead-capture brochure variant | LOW | LOW | P3 |
| Interactive project map | MEDIUM | HIGH | P3 |
| Per-project case-study detail pages | LOW-MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for this milestone's launch
- P2: Should have, add when possible after launch
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Fugro / Seequent (aspirational reference tier) | Local competitors (ARQUIDRON, JE&WJ, GeoXPert, Norte Urbano — inferred as drone/survey-only shops, not directly audited) | Our Approach |
|---------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|--------------|
| Service presentation | Card-grid linking to dedicated expertise pages (Fugro) or mega-menu + industry-vertical carousel (Seequent) | Likely simple service lists, minimal depth (typical of small local survey firms) | Card grid of 5 ejes + side-drawer for depth — matches reference tier's clarity without the multi-page depth Fugro's 35+ services need |
| Team/expertise proof | Named experts with credentials woven into content and case studies | Likely absent or minimal (small firms rarely feature named technical staff prominently) | 4 named geologist-founder profiles — this is a genuine SkyTech advantage per the brief's stated differentiator and should be visually prominent |
| Case studies | Structured challenge/method/outcome format, tied to named clients and sectors | Likely absent or anecdotal only | 3 real projects with client/location/service/deliverable, structured consistently, featured + list layout |
| Differentiation messaging | Data-backed claims, no competitor-naming, evidence via case studies | Likely price/speed-focused (brief states SkyTech competes on precision/tech/experience/attention, NOT price) | Evidence-based differentiation section reinforcing the "análisis y recomendaciones, no solo datos" positioning |
| Visual identity | Light, restrained, technical — never drone-only imagery | Likely drone-heavy imagery (their core service), simpler/generic design | Explicitly broaden beyond drones (geology/mining/civil imagery) to visually separate SkyTech from drone-only local shops |
| Equipment showcase | Present but understated (Trimble shows hardware categories, not a flashy carousel) | Unknown/likely absent | Equipment carousel per brief, with premium restrained treatment — matches Trimble-tier presentation, not consumer-carousel styling |

## Sources

- [Fugro expertise page](https://www.fugro.com/expertise) — WebFetch, confidence MEDIUM (single-source direct fetch, structurally consistent with other reference sites)
- [Seequent homepage](https://www.seequent.com/) — WebFetch, confidence MEDIUM
- [Trimble Geospatial homepage](https://geospatial.trimble.com/en) — WebFetch, confidence MEDIUM
- [Tetra Tech homepage](https://www.tetratech.com/) — WebFetch, confidence MEDIUM
- [SRK Consulting geotechnical/careers page](https://www.srk.com/en/geotechnical-category) — WebFetch, confidence LOW (careers-focused page, limited visual-design signal)
- WebSearch: "engineering consulting firm website team page expert profiles best practices" — confidence MEDIUM (aggregated, multiple corroborating sources incl. OpenAsset, Windmill Strategy)
- WebSearch: "geospatial engineering company website case studies project showcase design" — confidence MEDIUM (Axim Geospatial, Glanville Geospatial, NV5 Geospatial, Getmapping)
- WebSearch: "B2B professional services website differentiation section design" — confidence MEDIUM (Hinge Marketing, Orbit Media, thegood.com)
- WebSearch: "slide-out drawer panel UX pattern" — confidence MEDIUM (PatternFly, Mobbin, Creative Bloq, Oracle Alta Mobile — established pattern, well-corroborated)
- WebSearch: "downloadable brochure PDF gated content" — confidence MEDIUM
- WebSearch: "sticky fixed header mega menu navigation" — confidence MEDIUM (Mutual of Omaha design guide, general UX pattern sources)
- WebSearch: "enterprise B2B website avoid cartoon illustrations" — confidence LOW-MEDIUM (blog/marketing-agency sources, directionally consistent with client brief's own explicit veto)
- WebSearch: "equipment product carousel showcase industrial technology" — confidence LOW (general carousel UX sources, no industrial-sector-specific case directly audited)
- WebSearch: "mining consulting geotechnical company website imagery" — confidence LOW (SRK, Geosyntec, Stantec, Tetra Tech, AMC Consultants surfaced but not individually audited for imagery)
- Client brand brief, as recorded in `.planning/PROJECT.md` Context section (2026-07-18) — confidence HIGH (primary source, direct client requirements)

**Note on confidence:** No premium documentation/search providers (Context7, Exa, Brave, Tavily, Firecrawl) were configured for this research run — all findings derive from built-in WebSearch/WebFetch. Findings corroborated across 3+ independent reference sites are tagged MEDIUM; single-source or thin-evidence findings are tagged LOW and should not be treated as definitive without direct visual audit of the live reference sites during design/UI-spec work.

---
*Feature research for: Premium corporate/technical geospatial-engineering consulting website*
*Researched: 2026-07-18*
