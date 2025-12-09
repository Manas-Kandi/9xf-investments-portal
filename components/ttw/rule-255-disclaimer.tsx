export function Rule255Disclaimer({ offeringUrl }: { offeringUrl?: string }) {
  return (
    <div className="border-t border-white/10 mt-12 py-8 text-center text-xs text-white/40 uppercase tracking-wide">
      <div className="max-w-3xl mx-auto space-y-3 px-4">
        <p>NO MONEY OR OTHER CONSIDERATION IS BEING SOLICITED, AND IF SENT IN RESPONSE, WILL NOT BE ACCEPTED.</p>
        <p>NO OFFER TO BUY THE SECURITIES CAN BE ACCEPTED AND NO PART OF THE PURCHASE PRICE CAN BE RECEIVED UNTIL THE OFFERING STATEMENT FILED BY THE COMPANY WITH THE SEC HAS BEEN QUALIFIED BY THE SEC.</p>
        <p>ANY SUCH OFFER MAY BE WITHDRAWN OR REVOKED, WITHOUT OBLIGATION OR COMMITMENT OF ANY KIND, AT ANY TIME BEFORE NOTICE OF ACCEPTANCE GIVEN AFTER THE DATE OF QUALIFICATION.</p>
        <p>AN INDICATION OF INTEREST INVOLVES NO OBLIGATION OR COMMITMENT OF ANY KIND.</p>
        {offeringUrl && (
          <p className="mt-4 font-bold text-blue-400">
            <a href={offeringUrl} target="_blank" rel="noopener noreferrer">
              READ THE PRELIMINARY OFFERING CIRCULAR
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
