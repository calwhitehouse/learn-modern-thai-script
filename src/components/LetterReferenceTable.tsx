import { ThaiText } from "@/components/ThaiText";
import { THAI_SPELLING_KEYBOARD_GROUPS } from "@/lib/thai-alphabet";

export function LetterReferenceTable() {
  return (
    <div className="flex flex-col gap-8">
      {THAI_SPELLING_KEYBOARD_GROUPS.map((group) => (
        <section key={group.id}>
          <h2 className="text-sm font-medium text-stone-800">{group.label}</h2>
          <div className="mt-2 overflow-hidden rounded-xl border border-stone-200 bg-white">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-1/2" />
                <col className="w-1/2" />
              </colgroup>
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-xs text-stone-500">
                  <th
                    scope="col"
                    className="w-1/2 border-r border-stone-200 px-3 py-2.5 text-center font-medium sm:px-4 sm:py-3"
                  >
                    Old script
                  </th>
                  <th
                    scope="col"
                    className="w-1/2 px-3 py-2.5 text-center font-medium sm:px-4 sm:py-3"
                  >
                    Modern script
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.letters.map((letter) => (
                  <tr key={letter} className="border-b border-stone-100 last:border-0">
                    <td className="w-1/2 overflow-visible border-r border-stone-100 px-2 py-3 text-center align-middle sm:px-4 sm:py-3.5">
                      <ThaiText
                        variant="looped"
                        className="inline-block px-1 text-2xl leading-none sm:text-3xl"
                      >
                        {letter}
                      </ThaiText>
                    </td>
                    <td className="w-1/2 overflow-visible px-2 py-3 text-center align-middle sm:px-4 sm:py-3.5">
                      <ThaiText
                        variant="modern"
                        className="inline-block px-1 text-2xl leading-none sm:text-3xl"
                      >
                        {letter}
                      </ThaiText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
