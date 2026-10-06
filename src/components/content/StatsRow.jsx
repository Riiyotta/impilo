/* Spec 2.1 Stats: three short labels, bodyM white .8; not animated. */
export default function StatsRow({ stats }) {
  return (
    <div className="flex flex-wrap justify-center u-gap-[48] u-mt-[16] mob:flex-col mob:u-gap-[24]">
      {stats.map((s) => (
        <div key={s} className="type-body-m text-silver05 opacity-80">
          {s}
        </div>
      ))}
    </div>
  )
}
