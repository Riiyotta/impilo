import Pill from '../shared/Pill'
import PrimaryButton from '../shared/PrimaryButton'

const CARDS = [
  {
    icon: 'heart',
    title: 'RPM Hardware & Setup',
    desc: 'Each kit arrives configured, labeled, and ready to use, with cellular or Bluetooth devices paired in advance. Every unit is tested and tracked before it ships, so patients start taking readings the day it lands and programs see strong engagement.',
  },
  {
    icon: 'lightbulb',
    title: 'Patient Support & Engagement',
    desc: 'Friendly specialists guide patients through activation, troubleshooting, and day-to-day questions, with timely reminders by phone, text, or email. Our multi-channel, multilingual team works to industry-leading response targets—helping people stay engaged throughout their program.',
  },
  {
    icon: 'chat',
    title: 'At-Home Lab Collection Kits',
    desc: 'We assemble and ship branded collection kits with clear instructions and prepaid return packaging, then coordinate with partner labs so samples arrive intact and results flow back into your clinical systems without manual follow-up.',
  },
  {
    icon: 'document',
    title: 'DME & Medical Devices',
    desc: 'From blood pressure cuffs to mobility aids, we manage sourcing, setup, delivery, and replacements for durable equipment. Devices arrive connected and ready, reducing friction for clinicians and patients.',
  },
]

/* Spec 1.3 Support: white rounded panel with 4 cards that pin and stack (motion in solutions.js). */
export default function Support() {
  return (
    <section
      className="sol-support relative z-[1] grid place-items-center bg-silver05 text-center u-pt-[232] u-rounded-[24] tab:u-pt-[151] mob:rounded-b-none mob:u-pt-[100]"
      data-sol="support"
    >
      <Pill />
      <h2 className="type-h2 text-blue01 u-max-w-[1111] u-mt-[16] tab:u-max-w-[924] mob:type-h3 mob:u-max-w-[345]">
        Direct-to-Patient Solutions
      </h2>
      <p className="type-body-r text-blue01 u-max-w-[576] u-mt-[32] mob:u-max-w-[345]">
        From connected devices to lab kits and medical equipment, we bring every physical and digital piece of care
        home, tied into your clinical workflows.
      </p>

      <div className="sol-support__cards" data-sol="support-cards">
        {CARDS.map((c) => (
          <div
            key={c.icon}
            className="sol-support__card relative z-[1] mx-auto flex flex-col items-center justify-center border-solid border-lavender04 bg-silver04 u-mt-[150] u-pb-[100] u-pt-[66] u-rounded-[24] u-w-[860] [border-width:calc(var(--u)*1)] u-min-h-[548] mob:u-mt-[42] mob:u-pb-[66] mob:u-pt-[42] mob:u-px-[22.5] mob:u-w-[310]"
          >
            <div className="sol-support__card-image grid place-items-center u-h-[80] u-w-[80]">
              <img src={`/assets/svg/solutions-support-${c.icon}.svg`} alt="" />
            </div>
            <h3 className="type-h3 text-blue01 u-max-w-[400] u-mt-[35] mob:u-mt-[26]">{c.title}</h3>
            <p className="type-body-r text-blue01 u-max-w-[461] u-mt-[52]">{c.desc}</p>
          </div>
        ))}
      </div>

      <PrimaryButton href="/solutions/direct-to-patient/" className="u-mt-[80] mob:u-mt-[50]">
        Discover Our Patient-Ready Solutions
      </PrimaryButton>

      <img src="/assets/svg/solutions-support-thermo.svg" alt="" className="sol-support__thermo" data-sol="thermo" />
    </section>
  )
}
