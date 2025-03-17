import { SendBugReport } from "@/components/pages/settings/send-bug-report";
import { getUserId } from "@/db/queries";

export default async function SettingsPage() {
    const userId = await getUserId()
    if (!userId) return null

    return (<div className="w-full h-full py-4 px-8 border border-r-muted ">
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-4xl text-left">Bugs ou melhorias</h1>

        </div>
        <SendBugReport userId={userId} />
    </div>)
}