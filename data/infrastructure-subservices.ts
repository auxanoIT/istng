import { dataCentreSubservicePaths, getDataCentreSubservice } from "@/data/data-centre-subservices";
import { networkSubservicePaths, getNetworkSubservice } from "@/data/network-subservices";
import { hardwareSubservicePaths, getHardwareSubservice } from "@/data/hardware-subservices";
import { securitySubservicePaths, getSecuritySubservice } from "@/data/security-subservices";
import { itSupportSubservicePaths, getITSupportSubservice } from "@/data/it-support-subservices";

export const infrastructureSubservicePaths = [
  ...dataCentreSubservicePaths,
  ...networkSubservicePaths,
  ...hardwareSubservicePaths,
  ...securitySubservicePaths,
  ...itSupportSubservicePaths,
];

export function getInfrastructureSubservice(path: string) {
  return getDataCentreSubservice(path) ?? getNetworkSubservice(path) ?? getHardwareSubservice(path) ?? getSecuritySubservice(path) ?? getITSupportSubservice(path);
}
