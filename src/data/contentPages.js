/*
 * Template B data (specs/SOLUTIONS_USECASES_SPEC.md 2.3). Copy is original placeholder text written to
 * the spec's word/line counts and topics; short labels (stats, carousel subtitles, button labels) are
 * the spec's verbatim UI labels.
 *
 * Page shape:
 *   title, contentWidth (1000 | 800), subtitleVariant ('a' | 'b'), noPadTitles (DHL/clinic-rpm/support-crm),
 *   tightTitles (impilo-platform), heroMobileTitle ('h2' on DHL)
 *   hero: { title, subtitle, description?, cta: {label, href}, stats? }
 *   sections: [{ dark, title, tight?, subtitle?, blocks: [...] }]
 * Block types: borderedCards | iconCards | textItems | twoColumn | outcomes | carousel | cta | callToAction
 */

const ICON = {
  api: '/assets/svg/solutions-icon-api.svg',
  box: '/assets/svg/solutions-icon-box.svg',
  truck: '/assets/svg/solutions-icon-truck.svg',
  warehouse: '/assets/svg/solutions-icon-warehouse.svg',
  chat: '/assets/svg/solutions-support-chat.svg',
  iso: '/assets/svg/solutions-explore-logo-iso.svg',
  exploreBox: '/assets/svg/solutions-explore-box.svg',
}

const DEMO = { label: 'Request a Demo', href: '/request-demo/' }
const SCHEDULE = { label: 'Schedule a Demo', href: '/request-demo/' }
const TALK = { type: 'cta', label: 'Talk to Our Team', href: 'mailto:sales@impilo.health' }
const SEE_HOW_IT_WORKS = { type: 'cta', label: 'See How It Works', href: '/solutions/' }
const PLATFORM_STATS = ['400k+ Patients Connected', 'Compliant & Certified', 'Available in all 50 States']

export const contentPages = {
  /* ------------------------------------------------------------------ */
  /* Use-case pages (B2)                                                 */
  /* ------------------------------------------------------------------ */
  'virtual-care-companies': {
    title: 'Impilo | Virtual Care Companies',
    hero: {
      title: 'The Operational Backbone to Launch and Scale Virtual Care',
      subtitle:
        'Impilo gives virtual care companies the devices, logistics, platform, and patient support needed to grow programs nationwide, without building warehouses, hiring support staff, or stitching together a dozen separate vendors yourself.',
      cta: DEMO,
      stats: ['400k+ Patients Connected', 'Healthcare-Grade 3PL', 'API-First Platform'],
    },
    sections: [
      {
        title: 'Why Fast-Growing Virtual Care Teams Choose Impilo',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              { title: 'Logistics slow down every new launch', text: 'We store, kit, and ship devices nationwide so your team can launch new programs in weeks.' },
              { title: 'Device data arrives in different formats', text: 'Our platform normalizes readings from hundreds of devices into one clean, consistent stream for clinicians.' },
              { title: 'Patients struggle with device setup', text: 'Concierge specialists walk each patient through activation by phone or text, keeping adherence high.' },
              { title: 'Too many vendors to manage', text: 'One partner covers devices, labs, DME, fulfillment, and software, with a single contract and contact.' },
            ],
          },
          { type: 'cta', label: 'See How Impilo Works', href: '/solutions/' },
        ],
      },
      {
        dark: true,
        title: 'Everything Required to Operate Virtual Care Programs Nationwide at Scale, Consolidated Together',
        blocks: [
          {
            type: 'carousel',
            cards: [
              {
                subtitle: 'Digital Health Logistics',
                title: 'Devices Stored, Kitted, and Shipped to Every Patient',
                text: 'Our healthcare-grade 3PL handles warehousing, custom kitting, and nationwide delivery, with tracking and returns managed end to end for every shipment.',
              },
              {
                subtitle: 'Device Connectivity & RPM Platform',
                title: 'Connect Hundreds of Devices Through a Single Platform',
                text: 'Cellular and Bluetooth devices stream readings into one dashboard with alerts, time tracking, and billing support built in.',
              },
              {
                subtitle: 'Patient CRM & Engagement',
                title: 'Keep Patients Engaged From Their First Reading Onward',
                text: 'Automated reminders, two-way messaging, and a live support team help patients stay on track and keep measuring consistently.',
              },
              {
                subtitle: 'At-Home Labs & DME Delivery',
                title: 'Bring Labs and Medical Equipment Directly to the Home',
                text: 'Collection kits and durable equipment ship with clear instructions, and we coordinate returns, lab processing, and replacements on your behalf.',
              },
              {
                subtitle: 'And Much More',
                title:
                  'From custom kitting and branded packaging to reporting and integrations, we adapt services to fit your program',
              },
            ],
          },
        ],
      },
      {
        title: 'The Results You Can Expect',
        blocks: [
          {
            type: 'outcomes',
            items: [
              'Launch new programs faster with logistics, devices, and software already in place.',
              'Grow your patient base without adding warehouse space or hiring extra support staff.',
              'Give patients a polished first experience with ready-to-use kits and live help.',
              'Lower operating costs by replacing multiple vendors with one coordinated partner.',
              'Improve adherence and outcomes with consistent data, timely alerts, and proactive outreach.',
            ],
          },
          TALK,
        ],
      },
      {
        dark: true,
        title: 'Ready to Grow Your Virtual Care Program With a Partner?',
        blocks: [{ type: 'cta', ...DEMO }],
      },
    ],
  },

  'physicians-and-provider-groups': {
    title: 'Impilo | Physicians and Provider Groups',
    hero: {
      title: 'Remote Patient Monitoring Made Effortless for Independent Practices',
      subtitle:
        'Impilo equips physicians and provider groups with patient-ready devices, monitoring tools, and behind-the-scenes support, so your practice can offer remote care programs that improve outcomes and add revenue without overwhelming your front desk or nurses.',
      cta: DEMO,
      stats: ['400k+ Patients Connected', 'Healthcare-Grade Logistics & Support', 'Built for Clinical Workflows'],
    },
    sections: [
      {
        title: 'Built for Busy Practices',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              {
                title: 'Staff have no time to onboard patients',
                text: 'Our concierge team handles enrollment calls, device setup, and troubleshooting, so your nurses and front desk can stay focused on visits.',
              },
              {
                title: 'Ordering and tracking devices takes too long',
                text: 'We ship pre-configured kits straight to patients and track every unit, removing inventory headaches from your office entirely.',
              },
              {
                title: "Monitoring data doesn't fit existing clinical workflows",
                text: 'Readings, alerts, and time logs flow into tools your clinicians already use, with documentation ready for review and billing.',
              },
              {
                title: 'Starting a remote program feels too risky',
                text: 'Launch with minimal upfront investment and scale gradually, backed by a team that has supported hundreds of thousands of patients.',
              },
            ],
          },
          SEE_HOW_IT_WORKS,
        ],
      },
      {
        dark: true,
        title: 'Tools and Services That Help Your Practice Deliver Better Care',
        blocks: [
          {
            type: 'carousel',
            cards: [
              {
                subtitle: 'RPM Hardware & Patient-Ready Setup',
                title: 'Devices That Arrive Ready for Patients to Use',
                text: 'Every kit is configured, tested, and labeled before it ships, so patients can start measuring the moment it arrives.',
              },
              {
                subtitle: 'Monitoring Tools & Patient Coordination',
                title: 'See Every Reading and Coordinate Follow-Up in One Place',
                text: 'Dashboards flag out-of-range values and missed readings, while built-in messaging and task lists keep your care team aligned on next steps.',
              },
              {
                subtitle: 'Diagnostics, Devices & Supplies',
                title: 'Order Lab Kits, Equipment, and Supplies Without Extra Vendors',
                text: 'We source and deliver at-home lab kits, durable equipment, and everyday supplies, coordinating returns and replacements so nothing falls through the cracks.',
              },
              {
                subtitle: 'Behind-the-Scenes Infrastructure',
                title: 'Compliance, Logistics, and Support Handled Quietly in the Background',
                text: 'Certified warehousing, secure data handling, and a responsive support desk run behind your program, letting your practice focus on patients.',
              },
              {
                subtitle: 'And Much More',
                title:
                  'Branded kits, custom reporting, EHR connections, and flexible program design shaped around the way your practice works',
              },
            ],
          },
        ],
      },
      {
        title: 'What Your Practice Can Expect',
        blocks: [
          {
            type: 'outcomes',
            items: [
              'Offer remote monitoring to more patients without adding headcount or office space.',
              'Create a dependable new revenue stream with documentation that supports accurate billing.',
              'Catch worsening conditions earlier with timely alerts and consistent readings between visits.',
              'Give patients a simple, supported experience that keeps them engaged with their care plan over time.',
              'Reduce administrative burden on clinicians by handing off logistics and patient support.',
            ],
          },
          TALK,
        ],
      },
      {
        dark: true,
        title: 'Bring Remote Care to Your Practice This Year',
        blocks: [{ type: 'cta', ...DEMO }],
      },
    ],
  },

  'health-plans-and-payers': {
    title: 'Impilo | Health Plans and Payers',
    hero: {
      title: 'Monitoring Members Across Entire Populations',
      subtitle:
        'Impilo helps health plans and payers deploy connected devices, at-home diagnostics, and standardized data across their membership, supporting quality and cost goals while keeping administrative effort low.',
      cta: DEMO,
      stats: ['400k+ Patients Connected', 'Standardized, Vendor-Agnostic Data', 'Nationwide At-Home Capabilities'],
    },
    sections: [
      {
        title: 'Why Health Plans and Payers Choose Impilo',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              {
                title: 'Member programs are hard to roll out broadly',
                text: 'Our nationwide fulfillment network ships devices and kits to members in every state, with tracking from order to activation.',
              },
              {
                title: 'Device data from different vendors never lines up',
                text: 'We convert readings from every supported device into one standardized format your analytics teams can trust.',
              },
              {
                title: 'Closing care gaps requires reaching members at home',
                text: 'At-home lab kits and screening tools let members complete overdue tests without scheduling a clinic visit.',
              },
              {
                title: 'Members disengage soon after receiving a new device',
                text: 'Proactive outreach by phone, text, and email keeps members measuring and connected to their care teams.',
              },
              {
                title: 'Vendor management adds cost and complexity to every program',
                text: 'A single vendor-agnostic partner consolidates devices, logistics, labs, and data, simplifying contracts and oversight for your team.',
              },
            ],
          },
          SEE_HOW_IT_WORKS,
        ],
      },
      {
        dark: true,
        title: 'Capabilities Built to Support Members Wherever They Live',
        blocks: [
          {
            type: 'carousel',
            cards: [
              {
                subtitle: 'Connected Devices & RPM Infrastructure',
                title: 'Deploy Connected Devices Across Your Entire Membership',
                text: 'Cellular devices ship ready to use, so members never need Wi-Fi, apps, or pairing to start sending readings to their care team.',
              },
              {
                subtitle: 'At-Home Lab Kits & Diagnostic Workflows',
                title: 'Close Care Gaps With Diagnostics Completed at Home',
                text: 'We manage kit fulfillment, return logistics, and lab coordination, delivering results back in a format that fits your quality reporting.',
              },
              {
                subtitle: 'Standardized Data Across Vendors',
                title: 'One Consistent Data Model, No Matter the Device',
                text: 'Readings from hundreds of devices are mapped to a single schema, giving analysts and clinicians a reliable view of member health.',
              },
              {
                subtitle: 'Member Engagement & Outreach Tools',
                title: 'Keep Members Active and Measuring Over the Long Term',
                text: 'Automated reminders, live support, and targeted campaigns help members build lasting habits and stay connected to their programs.',
              },
              {
                subtitle: 'And Much More',
                title:
                  'Custom eligibility files, branded member materials, flexible reporting, and integrations designed around the way your plan operates',
              },
            ],
          },
        ],
      },
      {
        title: 'Results Your Plan Can Expect',
        blocks: [
          {
            type: 'outcomes',
            items: [
              'Reach more members with at-home monitoring in every state.',
              'Close care gaps faster with convenient at-home lab testing.',
              'Compare outcomes confidently across programs using standardized, vendor-agnostic device data.',
              'Improve quality measures with consistent readings and timely interventions.',
              'Lower administrative effort by working with one coordinated partner.',
              'Keep members engaged longer through proactive, multi-channel outreach and support.',
              'Scale programs quickly without building your own logistics infrastructure.',
            ],
          },
          TALK,
        ],
      },
      {
        dark: true,
        title: "Let's Support Your Members Together",
        blocks: [{ type: 'cta', ...DEMO }],
      },
    ],
  },

  'health-systems-and-msos': {
    title: 'Impilo | Health Systems and MSOs',
    hero: {
      title: 'Remote Care for Health Systems and Large MSOs',
      subtitle:
        'Impilo gives health systems and MSOs a single partner for remote monitoring, devices, logistics, and patient support, extending care beyond facility walls while fitting into the clinical systems you run.',
      cta: DEMO,
      stats: ['400k+ Patients Connected', 'Healthcare-Grade Logistics', 'Integrates Into Your Clinical Systems'],
    },
    sections: [
      {
        title: 'Why Health Systems and MSOs Choose Impilo',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              {
                title: 'Remote programs vary widely across departments and sites',
                text: 'Centralize monitoring, devices, and support on one platform so every department follows the same proven playbook and standards.',
              },
              {
                title: 'Clinical teams are already stretched too thin',
                text: 'Our concierge staff handles onboarding, troubleshooting, and routine outreach, freeing nurses and physicians to focus on clinical decisions.',
              },
              {
                title: 'Device data rarely reaches the EHR cleanly',
                text: 'Standardized readings and alerts flow into your existing clinical systems, keeping records complete without manual data entry by staff.',
              },
              {
                title: 'Supply chains for home care are fragmented',
                text: 'We source, store, and deliver devices, labs, and supplies through one healthcare-grade logistics network with full tracking visibility.',
              },
            ],
          },
          SEE_HOW_IT_WORKS,
        ],
      },
      {
        dark: true,
        title: 'Capabilities That Extend Your Care Beyond Facility Walls',
        blocks: [
          {
            type: 'carousel',
            cards: [
              {
                subtitle: 'Centralized Remote Care Infrastructure',
                title: 'One Foundation for Every Remote Care Program You Run',
                text: 'Bring monitoring, logistics, and support under one roof so new service lines launch quickly and existing ones run consistently.',
              },
              {
                subtitle: 'Monitoring & Workflow Automation',
                title: 'Automate the Routine Work Around Every Patient Reading',
                text: 'Rules-based alerts, task routing, and time tracking cut manual steps and help teams respond to the patients who need attention first.',
              },
              {
                subtitle: 'Patient-Ready Devices, Labs & Supplies',
                title: 'Everything Patients Need, Delivered Ready to Use',
                text: 'Configured devices, lab collection kits, and medical supplies arrive at the door with instructions and live help available if questions come up.',
              },
              {
                subtitle: 'Data Connectivity & Intelligent Insights',
                title: 'Turn Device Readings Into Insights Your Teams Can Act On',
                text: 'Normalized data and trend reporting reveal at-risk populations early, supporting care management, quality programs, and value-based contracts.',
              },
              {
                subtitle: 'And Much More',
                title:
                  "Integration support, branded patient materials, custom reporting, and dedicated program management tailored to your system's specific goals",
              },
            ],
          },
        ],
      },
      {
        title: 'Outcomes Your System Can Expect',
        blocks: [
          {
            type: 'outcomes',
            items: [
              'Standardize remote care across departments, sites, and affiliated practices under one model.',
              'Reduce avoidable admissions by spotting worsening conditions earlier between visits.',
              'Free clinical staff from logistics, device troubleshooting, and routine patient outreach tasks.',
              'Keep records complete with device data flowing into your existing clinical systems.',
              'Support value-based contracts with reliable, standardized data on patient populations.',
              'Scale home-based programs without building new warehouses or support centers yourself.',
            ],
          },
          TALK,
        ],
      },
      {
        dark: true,
        title: "Let's Architect Comprehensive Distributed Healthcare Infrastructure, Starting Today",
        blocks: [{ type: 'cta', ...DEMO }],
      },
    ],
  },

  'value-based-care': {
    title: 'Impilo | Value-Based Care',
    hero: {
      title: 'The Infrastructure You Need to Deliver Better Outcomes in Value-Based Care',
      subtitle:
        'Impilo helps value-based care organizations keep patients healthier at home with connected devices, at-home diagnostics, and proactive engagement, giving care teams the timely data they need to manage risk and reduce total costs.',
      cta: DEMO,
      stats: ['400k+ Patients Connected', 'Healthcare-Grade Logistics', 'API-First Platform'],
    },
    sections: [
      {
        title: 'Why Value-Based Teams Choose Impilo',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              {
                title: 'Risk is hard to manage when patients are out of sight',
                text: 'Connected devices deliver daily readings from home, so care teams can see changes early and intervene before costly events.',
              },
              {
                title: 'Care gaps stay open because members skip in-person testing',
                text: 'At-home lab kits make screenings convenient, helping patients complete overdue tests and helping your organization meet quality targets.',
              },
              {
                title: 'Engagement fades after the first few weeks of a program',
                text: 'Live support and automated outreach keep patients measuring consistently, sustaining the data streams your risk models depend on daily.',
              },
              {
                title: 'Building logistics in-house pulls resources away from patient care',
                text: 'We handle sourcing, fulfillment, returns, and compliance, letting your teams put their time and budget toward clinical priorities instead.',
              },
            ],
          },
          SEE_HOW_IT_WORKS,
        ],
      },
      {
        dark: true,
        title: 'Capabilities Designed for Value-Based Care Organizations',
        blocks: [
          {
            type: 'carousel',
            cards: [
              {
                subtitle: 'Patient-Ready Devices & RPM Setup',
                title: 'Devices Configured and Delivered Ready for Day One',
                text: 'We pre-pair and test every device, then ship it with simple instructions so patients start sending readings right away.',
              },
              {
                subtitle: 'Monitoring & Patient Coordination Tools',
                title: 'Prioritize the Patients Who Need Attention Most Right Now',
                text: 'Risk-based alerts, care team tasks, and messaging tools help coordinators reach the right patient at the right moment.',
              },
              {
                subtitle: 'At-Home Labs & Diagnostics',
                title: 'Complete Screenings Without Requiring a Clinic Visit',
                text: 'Collection kits arrive with clear guidance, and results return in formats that support gap closure and quality reporting.',
              },
              {
                subtitle: 'Data Connectivity & Intelligent Insights',
                title: 'Population Insights That Inform Smarter Risk Decisions',
                text: 'Standardized data from every device rolls up into trend views that highlight rising risk across your attributed population.',
              },
              {
                subtitle: 'And Much More',
                title:
                  'Custom program design, branded kits, reporting for payer contracts, and integrations that fit how your organization operates',
              },
            ],
          },
        ],
      },
      {
        title: 'What Your Team Can Expect',
        blocks: [
          {
            type: 'outcomes',
            items: [
              'Identify rising-risk patients earlier with daily readings and automated alerts from home.',
              'Close more care gaps by making screenings and lab tests convenient for patients at home.',
              'Reduce avoidable emergency visits and admissions through timely, proactive intervention by your care teams.',
              'Strengthen performance on quality measures with consistent, standardized data across your entire population.',
              'Lower operating costs by relying on one partner for devices, logistics, labs, and patient support.',
            ],
          },
          TALK,
        ],
      },
      {
        dark: true,
        title: 'Ready to Improve Outcomes Across Your Entire Value-Based Care Population?',
        blocks: [{ type: 'cta', ...DEMO }],
      },
    ],
  },

  oems: {
    title: 'Impilo | OEMs',
    hero: {
      title: 'Get Your Devices to More Patients at Home',
      subtitle:
        "Impilo helps device manufacturers get products into patients' hands through healthcare-grade fulfillment, platform integration, and distribution channels that connect your devices to active care programs nationwide.",
      cta: DEMO,
      stats: ['400k+ Patients Connected', 'Healthcare-Grade Fulfillment', 'Hundreds of Devices Integrated'],
    },
    sections: [
      {
        title: 'What OEM Partners Can Expect',
        blocks: [
          {
            type: 'outcomes',
            items: [
              'Reach new customers by connecting your devices to programs already serving patients across the country.',
              'Shorten the path from production to patient with healthcare-grade warehousing, kitting, and nationwide delivery.',
              'Make your device data more valuable by integrating it into a platform clinicians already use every day.',
              'Support DME billing and procurement requirements without building internal reimbursement expertise from scratch.',
              'Improve the patient experience with setup help and ongoing support delivered under a trusted service.',
            ],
          },
          SEE_HOW_IT_WORKS,
        ],
      },
      {
        dark: true,
        title: 'Capabilities That Help Your Devices Grow',
        blocks: [
          {
            type: 'carousel',
            cards: [
              {
                subtitle: 'Clinical-Grade Logistics & Fulfillment',
                title: 'Store, Kit, and Ship Devices to Patients Nationwide',
                text: 'Our certified facilities handle receiving, kitting, serialized tracking, and last-mile delivery, so your devices reach patients ready to use.',
              },
              {
                subtitle: 'Device Integration & Connectivity Platform',
                title: 'Integrate Once and Reach Every Program on the Platform',
                text: 'A single integration makes your device available to every care organization using our platform, with readings normalized automatically.',
              },
              {
                subtitle: 'Distribution, DME, & Procurement Support',
                title: 'Navigate Distribution, DME, and Procurement With an Experienced Partner',
                text: 'We help position your products within procurement channels and DME workflows, supporting documentation and supply agreements along the way.',
              },
              {
                subtitle: 'And Much More',
                title:
                  'Co-branded packaging, patient onboarding support, market feedback, and launch planning built around your product roadmap and goals',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: "Let's Accelerate Your Devices' Distribution Nationwide",
        blocks: [{ type: 'cta', ...DEMO }],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Solution sub-pages (B1)                                             */
  /* ------------------------------------------------------------------ */
  'impilo-platform': {
    title: 'Impilo | The Impilo Platform',
    tightTitles: true, // every section title has mb 24 (mobile 16), measured
    hero: {
      title: 'Infrastructure for Connected Remote Care',
      subtitle:
        'Connect devices, manage patients, and run every remote monitoring workflow from a single secure platform built for care teams.',
      cta: DEMO,
      stats: PLATFORM_STATS,
    },
    sections: [
      {
        title: 'Built Around How Care Teams Work',
        blocks: [
          {
            type: 'borderedCards',
            columns: 3,
            items: [
              {
                title: 'Unified Device Data',
                text: 'Readings from hundreds of cellular and Bluetooth devices arrive in one standardized format, ready for review the moment they are captured.',
              },
              {
                title: 'Smart Alerts and Tasks',
                text: 'Configurable thresholds and automated task lists help clinicians focus on patients who need attention instead of scrolling through normal readings.',
              },
              {
                title: 'Billing-Ready Documentation Built In',
                text: 'Time tracking, interaction logs, and monthly summaries are captured automatically, giving your billing team accurate records without extra work.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: 'Designed for Every Role',
        tight: true,
        subtitle: 'Tools that fit clinicians and operations teams',
        blocks: [
          {
            type: 'twoColumn',
            columns: [
              {
                headline: 'For Clinicians Managing Patient Care Daily',
                items: [
                  {
                    title: 'Patient Timeline View',
                    text: 'See readings, notes, messages, and alerts for each patient on a single timeline, making it easy to spot trends between visits.',
                  },
                  {
                    title: 'Prioritized Alert Queue',
                    text: 'Out-of-range readings and missed measurements are ranked by urgency so clinicians always know which patient to contact first.',
                  },
                ],
              },
              {
                headline: 'For Operations Teams Running the Program',
                items: [
                  {
                    title: 'Device Fleet Management',
                    text: 'Track every device from shipment to activation, monitor battery and connectivity, and trigger replacements before patients notice a problem.',
                  },
                  {
                    title: 'Program Reporting and Exports',
                    text: 'Enrollment, adherence, and billing reports update automatically and export in a click, keeping leadership informed without manual spreadsheet work.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Turn Your Data Into Clear Action',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            maxWidth: 1000,
            items: [
              {
                title: 'Trend Detection',
                text: "Rolling averages and change indicators surface gradual shifts in a patient's readings, helping teams step in before a minor issue escalates.",
              },
              {
                title: 'Population-Level Insights Across Programs',
                text: 'Dashboards aggregate data across programs and cohorts, showing adherence, outcomes, and risk patterns that guide staffing and program design decisions.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: 'See the Platform in Action for Yourself',
        blocks: [{ type: 'cta', flush: true, ...DEMO }],
      },
    ],
  },

  'digital-health-logistics': {
    title: 'Impilo | Digital Health 4PL & Logistics',
    contentWidth: 800,
    heroMobileTitle: 'h2', // hero title stays h2-size (92) on mobile, measured
    subtitleVariant: 'b',
    noPadTitles: true,
    hero: {
      title: 'Health Logistics Built for Scale',
      subtitle:
        'Warehousing, kitting, and delivery designed for medical devices, so every patient receives the right equipment on time, every time.',
      cta: SCHEDULE,
    },
    sections: [
      {
        title: 'What We Handle',
        blocks: [
          {
            type: 'iconCards',
            columns: 2,
            items: [
              {
                icon: ICON.box,
                title: 'Custom Kitting',
                text: 'Devices, accessories, and printed guides are assembled into branded kits tailored to each program.',
              },
              {
                icon: ICON.truck,
                title: 'Nationwide Delivery',
                text: 'Fast shipping to all 50 states with real-time tracking, delivery confirmation, and proactive exception handling for every order.',
              },
              {
                icon: ICON.exploreBox,
                title: 'Secure Warehousing',
                text: 'Climate-aware storage with serialized inventory control keeps devices protected and accounted for until they ship.',
              },
              {
                icon: ICON.iso,
                title: 'Certified Quality Processes',
                text: 'Documented procedures and regular audits keep every step aligned with recognized quality and healthcare standards.',
              },
            ],
          },
        ],
      },
      {
        // Original bug: this title rendered blue01 on blue01 (no `dark` prop). Fixed here: rendered white.
        dark: true,
        title: 'Logistics Capabilities',
        blocks: [
          {
            type: 'textItems',
            columns: 3,
            items: [
              { title: 'Inventory Visibility', text: 'Live stock levels and serialized tracking show exactly where every device sits at any moment.' },
              { title: 'Returns Management', text: 'Prepaid labels and refurbishment workflows bring devices back into circulation quickly and cost-effectively.' },
              { title: 'Device Configuration', text: 'Units are paired, tested, and set up before shipping so patients can start immediately.' },
              { title: 'Order Automation', text: 'Orders can be triggered through the platform or API, removing manual steps from enrollment to shipment.' },
              {
                title: 'Compliant Handling',
                text: 'Every process is designed around healthcare privacy, security, and quality requirements from start to finish.',
              },
              {
                title: 'Scalable Capacity',
                text: 'Our network flexes with your volume, supporting pilots of a few dozen patients and national rollouts of many thousands.',
              },
            ],
          },
        ],
      },
      {
        title: 'Ready to Modernize Healthcare Logistics?',
        blocks: [
          {
            type: 'callToAction',
            text: 'Talk with our team to see how healthcare-grade logistics can shorten launch timelines and keep your patients well equipped.',
            ...SCHEDULE,
          },
        ],
      },
    ],
  },

  'tech-enabled-services': {
    title: 'Impilo | Tech-Enabled Services',
    hero: {
      title: 'Tech-Enabled Services',
      subtitle:
        'Expert people and purpose-built technology work together to run the operational side of your remote care program from start to finish.',
      // Spec gives the label "See how" but no href; /request-demo/ mirrors the /solutions/ hero "See how".
      cta: { label: 'See how', href: '/request-demo/' },
      stats: PLATFORM_STATS,
    },
    sections: [
      {
        title: 'Operations Handled by People Who Care',
        blocks: [
          {
            type: 'iconCards',
            columns: 3,
            items: [
              {
                icon: ICON.iso,
                title: 'Compliance Built Into Every Step',
                text: 'Our teams follow documented procedures aligned with healthcare quality and privacy standards, with regular audits to keep everything on track.',
              },
              {
                icon: ICON.warehouse,
                title: 'Healthcare-Grade 3PL Warehousing and Kitting',
                text: 'Secure facilities store, configure, and kit devices and supplies so each shipment leaves ready for the patient.',
              },
              {
                icon: ICON.truck,
                title: 'Delivery and Returns Managed for You',
                text: 'We coordinate shipping, tracking, and returns across all 50 states, resolving delivery issues before they disrupt care.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: 'A Support Team That Works Like Your Own',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              {
                title: 'Patient Onboarding and Setup',
                text: 'Specialists call each new patient, walk through device setup, and confirm the first reading is received successfully.',
              },
              {
                title: 'Ongoing Engagement Outreach',
                text: 'Friendly reminders by phone, text, and email keep patients measuring consistently throughout their program.',
              },
              {
                title: 'Device Troubleshooting and Replacements',
                text: 'When a device stops reporting, our team diagnoses the issue remotely and ships a replacement if needed.',
              },
              {
                title: 'Escalations to Your Clinicians',
                text: 'Clinical concerns raised during calls are documented and routed to your care team through agreed escalation paths, so nothing gets missed.',
              },
            ],
          },
        ],
      },
      {
        title: 'Technology That Keeps Every Operation Running Smoothly',
        blocks: [
          {
            type: 'textItems',
            columns: 3,
            items: [
              {
                title: 'Automated Order Workflows',
                text: 'Enrollment events trigger device orders automatically, so kits ship without anyone re-entering patient details by hand.',
              },
              {
                title: 'Real-Time Status Tracking',
                text: 'Every order, shipment, and support ticket is visible in one place, with live updates whenever anything changes.',
              },
              {
                title: 'Operational Reporting',
                text: 'Clear reports on fulfillment times, engagement rates, and support volume help you measure program health over time.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: 'See Our Services in Action',
        blocks: [{ type: 'callToAction', label: 'See how', href: '/request-demo/' }],
      },
    ],
  },

  'direct-to-patient': {
    title: 'Impilo | Direct-to-Patient Solutions',
    hero: {
      title: "Care Delivered Straight to Every Patient's Doorstep",
      subtitle:
        'Devices, lab kits, medical equipment, and support arrive ready to use, making home the most convenient place to receive care.',
      cta: DEMO,
      stats: PLATFORM_STATS,
    },
    sections: [
      {
        title: 'Patient-Ready Experiences, Delivered Everywhere',
        blocks: [
          {
            type: 'borderedCards',
            columns: 4,
            compact: true,
            items: [
              {
                title: 'RPM Device Kits',
                text: 'Blood pressure cuffs, scales, glucometers, and pulse oximeters arrive configured and paired, so patients can take their first reading within minutes.',
              },
              {
                title: 'At-Home Lab Kits',
                text: 'Collection kits include clear instructions and prepaid returns, and we coordinate with labs so results reach your team quickly.',
              },
              {
                title: 'Durable Medical Equipment',
                text: 'We source, document, and deliver durable equipment to the home, then manage servicing and replacements whenever patients need them.',
              },
              {
                title: 'Live Patient Support',
                text: 'A friendly support team answers setup questions by phone, text, or chat and follows up to keep patients engaged with their care plan over time.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: 'How Every Delivery Comes Together',
        blocks: [
          {
            type: 'borderedCards',
            columns: 3,
            compact: true,
            dark: true,
            items: [
              {
                title: 'Order and Configure',
                text: 'Orders arrive through the platform or API, and our team configures each device for the specific patient and program.',
              },
              {
                title: 'Pack and Ship',
                text: 'Kits are assembled with printed guides and shipped nationwide with tracking, so you always know when a patient is ready.',
              },
              {
                title: 'Activate and Support',
                text: 'Our specialists confirm delivery, guide patients through setup, and stay available for questions long after the first reading.',
              },
            ],
          },
        ],
      },
      {
        title: 'Supplies and Equipment Managed Carefully for Every Patient',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            centerLast: true,
            items: [
              {
                title: 'Procurement Made Simple',
                text: 'We source devices and supplies from vetted manufacturers, balancing quality, availability, and cost for every program we support.',
              },
              {
                title: 'Inventory You Can Trust',
                text: 'Serialized tracking and regular audits keep stock accurate, so the right items are always available when patients need them.',
              },
              {
                title: 'DME Documentation Handled',
                text: 'Our team prepares the paperwork that durable medical equipment requires, keeping your program organized and ready for payer review.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: "Bring Comprehensive Healthcare Into Patients' Homes",
        blocks: [{ type: 'callToAction', label: 'See how', href: '/request-demo/' }],
      },
    ],
  },

  'clinic-rpm': {
    title: 'Impilo | DIY RPM Solution',
    contentWidth: 800,
    subtitleVariant: 'b',
    noPadTitles: true,
    hero: {
      title: 'Independently Operate Your Own Remote Monitoring Program Confidently',
      subtitle:
        'Everything your clinic needs to launch a do-it-yourself RPM program, including devices, software, and support, without outsourcing your patient care.',
      cta: SCHEDULE,
    },
    sections: [
      {
        title: 'Everything Your Clinic Needs, Operated Independently',
        blocks: [
          {
            type: 'iconCards',
            columns: 3,
            items: [
              {
                icon: ICON.api,
                title: 'Easy Platform Access',
                text: 'Your staff log in to a simple dashboard to enroll patients, review readings, and document care time, with no complex setup or lengthy training required.',
              },
              {
                icon: ICON.box,
                title: 'Ready-to-Ship Device Kits',
                text: 'Order cellular devices in any quantity and we ship them preconfigured to patients or your clinic, so monitoring starts the day they arrive.',
              },
              {
                icon: ICON.chat,
                title: 'Support When Needed',
                text: 'Our team helps your staff and patients with device questions, connectivity issues, and platform tips, so your clinic is never left on its own.',
              },
            ],
          },
        ],
      },
      {
        // Original bug: this title rendered blue01 on blue01 (no `dark` prop). Fixed here: rendered white.
        dark: true,
        title: 'Why Clinics Choose DIY',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              {
                title: 'Keep Full Control',
                text: 'Your clinicians manage every patient relationship directly, using our tools without handing care to a third party.',
              },
              {
                title: 'Predictable Costs',
                text: 'Simple pricing for devices and software makes budgeting straightforward as your program grows.',
              },
              {
                title: 'Fast Launch',
                text: 'Start enrolling patients within days, with templates and onboarding guidance that shorten your setup time.',
              },
              {
                title: 'Billing Confidence',
                text: 'Automatic time tracking and reading counts help your team document care accurately and prepare clean claims each month.',
              },
            ],
          },
        ],
      },
      {
        title: 'Start Your Own In-House RPM Program',
        blocks: [
          {
            type: 'callToAction',
            text: 'Schedule a short walkthrough with our team to see how your clinic can launch remote monitoring with ready devices and simple, intuitive software.',
            ...SCHEDULE,
          },
        ],
      },
    ],
  },

  'support-crm': {
    title: 'Impilo | CRM for Healthcare Providers',
    contentWidth: 800,
    subtitleVariant: 'b',
    noPadTitles: true,
    hero: {
      title: 'Patient Support Infrastructure for Providers',
      subtitle: 'A CRM that keeps every patient conversation in one place.',
      description:
        'Track outreach, manage support tickets, and coordinate follow-ups across your team, so patients get timely answers and providers stay informed about every single interaction.',
      cta: SCHEDULE,
    },
    sections: [
      {
        title: 'Core CRM Features',
        blocks: [
          {
            type: 'iconCards',
            columns: 3,
            items: [
              {
                icon: ICON.api,
                title: 'Connected Patient Records',
                text: 'Every call, message, reading, and ticket is linked to the patient record, giving your team full context before each conversation. Integrations with the monitoring platform keep information current without manual updates or duplicate entry.',
              },
              {
                icon: ICON.chat,
                title: 'Multi-Channel Communication Tools',
                text: 'Reach patients by phone, text, or email from a single workspace, with templates and scheduled reminders that keep outreach consistent and save staff hours every week.',
              },
              {
                icon: ICON.iso,
                title: 'Secure and Compliant by Design',
                text: 'Role-based permissions, audit trails, and encrypted storage protect sensitive health information, while documented processes help your organization meet privacy obligations and pass reviews with confidence and far less preparation.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: 'Team Workflows',
        blocks: [
          {
            type: 'textItems',
            columns: 3,
            items: [
              { title: 'Ticketing', text: 'Log, assign, and resolve patient requests with clear ownership and status tracking throughout.' },
              { title: 'Task Queues', text: 'Prioritized lists show each team member exactly which patients need outreach today.' },
              { title: 'Escalations', text: 'Urgent concerns route to the right clinician instantly, with notes attached for context.' },
            ],
          },
        ],
      },
      {
        title: 'Benefits for Your Care Team',
        blocks: [
          {
            type: 'textItems',
            columns: 2,
            items: [
              {
                title: 'Faster Responses to Every Patient Question',
                text: 'Shared inboxes and templates help staff reply quickly and consistently, even during busy periods.',
              },
              {
                title: 'Fewer Missed Follow-Ups Across Programs',
                text: 'Automated reminders and task queues make sure no patient falls through the cracks after an alert or missed reading.',
              },
              {
                title: 'Clear Visibility Into Team Performance',
                text: 'Dashboards show response times, open tickets, and outreach volume so managers can balance workloads.',
              },
              {
                title: 'Better Experiences for Patients and Families',
                text: 'Patients reach a knowledgeable person quickly, and caregivers can be included in conversations when patients choose to share access.',
              },
            ],
          },
        ],
      },
      {
        dark: true,
        title: 'Empower Your Organization With Smarter Communication',
        blocks: [
          {
            type: 'callToAction',
            light: true,
            text: 'Book a short demo to see how a connected CRM can simplify patient support and keep your care team aligned.',
            ...SCHEDULE,
          },
        ],
      },
    ],
  },
}

/* Route path -> page key */
export const contentPageRoutes = [
  { path: '/solutions/impilo-platform/', key: 'impilo-platform' },
  { path: '/solutions/digital-health-logistics/', key: 'digital-health-logistics' },
  { path: '/solutions/tech-enabled-services/', key: 'tech-enabled-services' },
  { path: '/solutions/direct-to-patient/', key: 'direct-to-patient' },
  { path: '/solutions/clinic-rpm/', key: 'clinic-rpm' },
  { path: '/solutions/support-crm/', key: 'support-crm' },
  { path: '/use-cases/virtual-care-companies/', key: 'virtual-care-companies' },
  { path: '/use-cases/physicians-and-provider-groups/', key: 'physicians-and-provider-groups' },
  { path: '/use-cases/health-plans-and-payers/', key: 'health-plans-and-payers' },
  { path: '/use-cases/health-systems-and-msos/', key: 'health-systems-and-msos' },
  { path: '/use-cases/value-based-care/', key: 'value-based-care' },
  { path: '/use-cases/oems/', key: 'oems' },
]
