import * as IPCIDR from 'ip-cidr';

export function addrToPeer(addr: string): string | null | undefined {
	if (addr == null) return addr;

	if (addr.includes(':')) {
		// v6は/64単位
		const cidr = new IPCIDR(`${addr}/64`);
		if (!cidr.isValid()) return null;
		return cidr.start();
	} else {
		return addr;
	}
}
