export interface Props {}

export default function Home(props: Props) {
  return (
    <div>
      <form action="/api" method="post" encType="multipart/form-data">
        <fieldset>
          <label htmlFor="img">Cover</label>
          <input type="file" name="img" id="img" required multiple={false} />
        </fieldset>
        <fieldset>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required maxLength={256} />
        </fieldset>

        <fieldset>
          <label htmlFor="source">Source</label>
          <input
            type="file"
            name="source"
            id="source"
            required
            multiple={false}
          />
        </fieldset>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
