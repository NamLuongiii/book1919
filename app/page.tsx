import { Button } from "@/ui";
import { FileInput } from "@/ui/file-input";
import { TextInput } from "@/ui/text-input";

export interface Props {}

export default function Home(props: Props) {
  return (
    <div>
      <form action="/api" method="post" encType="multipart/form-data">
        <fieldset>
          <label htmlFor="img">Cover</label>
          <FileInput
            type="file"
            name="img"
            id="img"
            required
            multiple={false}
            maxMb={5}
            accept={{
              "image/jpeg": [".jpeg", ".jpg"],
              "image/png": [".png"],
            }}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="name">Name</label>
          <TextInput name="name" id="name" maxLength={256} />
        </fieldset>

        <fieldset>
          <label htmlFor="source">Source</label>
          <FileInput
            type="file"
            name="source"
            id="source"
            required
            multiple={false}
            maxMb={300}
          />
        </fieldset>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
