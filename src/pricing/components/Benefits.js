
const benifits = [
  {
    title: "One low price",
    subtitle: "Save bit. Get everything with a super low monthly subscription.",
  },
  {
    title: "No limits",
    subtitle: "Get complete access to everything on the site."
  },
  {
    title: "Cancel anytime",
    subtitle: "Pause or stop your subscription whenever you like."
  }
]

export default function Benefits() {

  return (
    <div className="bg-teal">
      <div className="column-padding">
        <div className="content-grid xl">
         {benifits.map(benifit => (
          <div key={benifit.title} className="spacing-base">
            <h3>
              {benifit.title}
            </h3>
            <div>{benifit.subtitle}</div>
          </div>
         ))}
        </div>
      </div>
    </div>
  )
}
