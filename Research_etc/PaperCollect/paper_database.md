---
title: Paper Database
layout: formal_default
---
# Paper Database

==================================

## Paper 1

### Title

Element-resolved local lattice distortion in complex concentrated alloys: An observable signature of electronic effects

### Authors

Oh Hyun Seok, Odbadrakh Khorgolkhuu, Ikeda Yuji, Mu Sai, Körmann Fritz, Sun Cheng-Jun, Ahn Heh Sang, Yoon Kook Noh, Ma Duancheng, Tasan Cemal Cem, Egami Takeshi, Park Eun Soo

### Abstract

N/A

### Journal

Acta Materialia

### DOI

10.1016/j.actamat.2021.117135

### Date

2021/7/1

### Subject

Metals and Alloys, Polymers and Plastics, Ceramics and Composites, Electronic, Optical and Magnetic Materials

### Introduction

Complex concentrated alloys (CCAs) including high-entropy alloys (HEAs) are composed of multiple principal elements, and the interplay among constituent elements determines the overall properties [1] . Because they are chemically complex, it is challenging to elucidate their properties in terms of detailed features of local atomic structure in CCAs. For example, severe lattice distortion ( Fig. S1 ) has been suggested to be responsible for various desirable properties [ 1 , 2 ] , such as solid-solution strengthening [3] [4] [5] , sluggish diffusion [6] , unusual electrical and thermal conductivity [ 7 , 8 ] , and irradiation resistance [ 7 , 9 ] . A number of experimental [ 4 , 5 , 10-14 ] , computational [ 3-5 , 14-19 ] , and theoretical studies small effective atomic sizes due to charge transfer away from Cr. Consequently, they are under tension. Therefore, when we consider CCAs we have to depart from the conventional practice in order to understand the atomic structure-property correlation.

### Sample preparation

CCAs studied in the present work (Ni, CoNi, FeNi, MnCoNi, MnFeNi, CrCoNi, FeCoNi, CrMnCoNi, MnFeCoNi, CrFeCoNi, CrMn-FeCoNi) were produced by the arc melting method using pure elements with above 99.9% purity under Ti-gettered Argon atmosphere. The as-cast buttons were suction casted followed by homogenization, cold rolling, and recrystallization annealing, and then ground into a 15 μm-thick ribbon. Conditions are described in detail in the method section of a previous study [14] .

### EXAFS analysis

EXAFS measurements were carried out at the 20-BM beamline of Advanced Photon Source in Argonne National Laboratory. The X-ray absorption spectra for Cr, Mn, Fe, Co, and Ni were collected in transmission mode using 0.8 mm ×4 mm unfocused X-ray beam to include more than 100 grains for uniformity. A Si (111) monochromator was detuned to 70-85% of its original intensity to reject higher-order harmonics. Samples were cooled in the cryogenic chamber under vacuum condition. The obtained datasets of 3d CCAs were aligned and processed to avoid instrumental background and absorption from other edges using the Athena in the IFEFFIT 1.2.11d suite of software [22] . All processes were conducted in the same conditions: pre-edge range with the energy of −150 to −30 eV, normalization range with the energy of 50-500 eV, and spline range with wave numbers of 0-11 Å −1 . The extracted EX-AFS data were weighted by k 2 and then converted to R space by Fourier transformation to obtain the magnitude plots of the EXAFS spectra. The first peaks of each element at different temperatures were fitted simultaneously considering the Einstein equation using the Artemis software. The theoretical calculation of the amplitude reduction factors of Cr (0.955), Mn (0.935), Fe (0.941), Co (0.947), and Ni (0.951) was performed using the FEFF8.4 code [23] . Fitting conditions are described in detail in the method section of a previous study [14] .

### DFT calculations 2.3.1. Impact of various factors on lattice distortion in CrMnFeCoNi

To evaluate the impact of different factors (atomic volume, charge transfer, magnetic states, and possible CSRO) on lattice distortion in CrMnFeCoNi, we conducted DFT calculations with supercell models based on special quasi-random structure (SQS) [24] construction. To optimize the atomic positions, the projected augmented wave method (PAW) [25] as implemented in Vienna ab-initio simulation package (VASP) [ 26 , 27 ] was utilized. The exchange-correlation was treated in the Generalized Gradient Approximation (GGA), parametrized by Perdew et al . [28] . The 240atom containing supercells model constructed from a 3 ×4 ×5 expansion of the conventional fcc cubic unit cell was used. The plane wave energy cutoff of 400 eV and a -centered 4 ×3 ×2 k-point mesh was applied. The Methfessel-Paxton scheme was used with smearing 0.1 eV. Total energies were minimized until they converged within 5 ×10 −4 eV per supercell. Internal atomic positions were relaxed until forces on atoms are less than 5 ×10 −2 eV/ Å , while the cell shape was again kept fixed.

### Atomic-level pressure and charge transfer in 3d CCAs

To evaluate the atomic-level pressure, we conducted further DFT calculations with supercell models using the VASP code mentioned above based on the same methodology. The 256-supercell models were obtained based on SQS configurations. Cutoff energy and smearing parameters for the Methfessel-Paxton scheme were chosen as above. The -centered 2 ×2 ×2 Monkhorst-Pack grids [37] for the Brillouin zone integration were used. The equilibrium volumes of the SQS structures were first optimized until the pressure vanishes, followed by atomic relaxation until the Hellmann-Feynman forces were lower than 0.005 eV/ Å . The cubic cell shape was kept throughout our calculations. All supercell calculations, except for CrCoNi, were performed based on collinear magnetic states 1 . 1 CrCoNi is treated as nonmagnetic considering a previous publication [62] , which shows that the measured magnetization of CrCoNi is 0.004 μ B /atom even in the presence of H = 5T. Although not included in this paper, we also checked magnetic CrCoNi (collinear), and the displacement pattern was more or less inert to the mag-In order to evaluate the atomic-level pressure and charge transfer, the calculation was repeated for different volume strains. The relaxed atomic structure for each volume strain was further processed with the Locally Self-Consistent Multiple Scattering (LSMS) method [ 38 , 39 ] to calculate the atomic-level pressure [40] . Once optimized by VASP, in the LSMS method we did not reoptimize the structure. Atomic-level pressure calculations require a definition of atomic volume in a crystal. We used the Voronoi tessellation as implemented in the LSMS method to decompose a supercell into volumes for each atom in the structure. This approach allows full relaxation of the electron density under cell distortions, minimizing the electronic energy of the system under imposed strain. This electronic relaxation is what distinguishes our method from the affine transformation originally introduced by Nielsen and Martin [ 41 , 42 ] . Atomic potentials were approximated as spherically symmetric (ASA). The exchange-correlation energy was treated in the local approximation using the function of von Barth and Hedin [43] . Energy and electron density were then integrated within a Voronoi polyhedron, thus obtaining the atomic-level information for each atom. In particular, the charge transfer was calculated as a difference between the integrated charge in the Voronoi polyhedron and the total charge of an individual atom. The optimized supercell structures were subject to affine deformations, in which the volume of the supercell was changed and atomic energies were calculated using the LSMS method. In general, the atomic-level stress tensor is defined as [ 44 , 45 ] :

### Dependence of ELLD on the atomic number: EXAFS experiment

The EXAFS spectrum includes the information about the element-resolved local atomic structure (i.e., the average bond length and the local static fluctuation of bond lengths of each element) of the selected elements in an alloy. In particular, the EX-AFS peak height is determined by the number of nearest-neighbor atoms ( N j , where j is the constituent element), the scattering amplitude ( f j ), and the EXAFS Debye-Waller factor ( σ 2 j ), according to the EXAFS equation [46] ,

### Factors affecting the atomic number dependency of ELLD: DFT calculation

Displacement of an individual atom in CCAs can be affected by various factors, such as atomic size, charge transfer, magnetism, and local ordering. In order to find the origin of the observed dependence between the fluctuation of bond lengths and the atomic number, we perform the DFT calculation that can provide the atom-wise lattice distortion (i.e., atomic displacement) and the quantum-mechanical information of each atom. As a benchmark, CrMnFeCoNi with the ferromagnetic state is chosen (the reason will be explained in Section 3.2.3 ), and the correlations between the aforementioned factors and ELLD are examined.

### Voronoi atomic volume

We first examine the correlation between Voronoi atomic volume and ELLD, as it is an observable topological factor that can partially represent the lattice distortion [20] . Fig. 3 a presents the DFT-calculated Voronoi atomic volumes and atomic displacements in CrMnFeCoNi. The atomic displacement is calculated as the distance of each atom from the ideal fcc crystal sites 2 . The overall 2 Atomic displacement is used instead of bond length to resolve the lattice distortion of the individual atom. The change in the bond length before and after the dis-

### .2.Charge transfer

The electronegativity values of Cr (1.65), Mn (1.75), Fe (1.80), Co (1.84), and Ni (1.88) follow the order of atomic number. Therefore, charge transfer might be the major cause of the observed correlation between atomic number and ELLD. Fig. 4 a presents the relationship between the atomic displacement and the charge transfer (Bader charge) of CrMnFeCoNi. Other equiatomic 3d CCAs from the binary CoNi to the quaternary CrFeCoNi are displayed in Fig. S4 . The overall tendency of atomic displacements follows the charge transfer; elements with negative Bader charges (acquiring electrons) have small atomic displacements and vice versa. Fig. 4 b presents the relationship between the atomic displacement and the Bader volume. Fig. 4 c shows the average atomic displacement of each element and fluctuation of atomic displacement of each element due to local static difference shown in Fig. 4 b , which decrease with an increase in the Bader volume. Assuming random chemical ordering, the degree of the fluctuation of the chemical environment would be similar within all constituent elements in an alloy. The pattern observed through Fig. 4 thus implies that the dependence of the ELLD on the atomic number originates from the chemical character of the central element, which could be the charge transfer (i.e., Bader volume). This tendency is also seen in the experimental results that the static disorder shows a negatively proportional correlation with electronegativity of each element ( Fig. 4 d ) . 

### Magnetism

It has been discussed in previous works that the variation in local magnetic moments can affect the lattice distortion in metals [ 5 , 48-50 ] . As 3d CCAs contain either ferromagnetic (Fe, Co, and Ni) or anti-ferromagnetic (Cr and Mn) elements, local spin ordering may affect the ELLD of 3d CCAs. To elaborate on this, we perform the DFT calculations for FM (spin-polarized) and NM (nonspin polarized) states of CrMnFeCoNi to investigate the influence of magnetism on the atomic number dependency of ELLD. Figs. 5 a1 and a2 present the distribution of magnetic moments of individual atoms in the FM and NM states obtained in this work. Inspecting the converged results, we find for FM state that Fe, Co, and Ni have positive magnetic moments, and Mn has antiparallel magnetic moments to Fe, Co, and Ni. Cr moments converge to both parallel and antiparallel magnetic moments. By construction, in the NM state, all elements have no local magnetic moments.

### Short-range ordering

Until now, we have assumed a random configuration of elements, whereas in reality there may be some local chemical ordering as well as local compositional fluctuations. Due to the magnetic spin-ordering, it may be energetically more preferable if the Cr atoms with anti-ferromagnetism are not first-nearest neighbors to avoid magnetic frustration [30] . Indeed the existence of CSRO in CrFeCoNi and CrCoNi has been proposed by simulations (DFT [30] ) and experiments (scanning transmission electron microscopy [ 30 , 52 ] , EXAFS [53] ). Similar Cr-Cr repulsion may be expected also for CrMnFeCoNi, and therefore we also examine the effects of potential Cr SRO on the lattice distortion in CrMnFeCoNi by the DFT calculation. As a hypothetical limit of CSRO, we considered the L1 2 phase where Cr only occupies one of the four fcc sublattices while the other elements are still randomly distributed (hereafter we call this Cr-L1 2 ), as shown in Fig. 6 a . Both the fully disordered A1 and the Cr-L1 2 phases were modeled based on the SQS concept [24] .

### Discussion

In this study, we show that the ELLD in 3d CCAs follows the atomic number through experiments and DFT calculations. We examine the effects of Voronoi atomic volume, charge transfer, magnetism, and short-range ordering to investigate the origin of the dependence of ELLD on the atomic number. We show that the charge transfer caused by the difference in the electronegativity among the constituent elements dominates the atomic number dependence of ELLD. In this section, we discuss the origin of the correlation between the charge transfer and ELLD and its implication on total lattice distortion. We also discuss the effects of SRO on the solid solution strength in 3d CCAs, which could be drawn from the results of Section 3.2.4 .

### Origin of the relationship between ELLD and charge transfer

Previously, some of the present authors showed that the atomic-level pressure in 3d CCAs is dominated by the charge transfer between neighboring elements [14] ; an example is shown in the inset of Fig. 7 a . The elemental dependence thus presents itself also in the relationship between the atomic-level pressure that originates from charge transfer and the atomic displacement ( Fig. 7 a and Fig. S6 ). The atomic-level pressure reflects the gradient of the interatomic potential energies between the central atom and the surrounding environments with respect to volume change.

### Relationship between charge transfer and total lattice distortion

The dependence of local lattice distortion on chemical elements in 3d CCAs not only explains element-specific problems but also sheds light on the magnitude of the total lattice distortion. Fig. 10 a displays the atomic displacements of CoNi and CrMnFeCoNi. Both the mean values and fluctuation of atomic displacements of CrMn-FeCoNi are larger than those of CoNi. The fluctuation of the charge transfer contributes to the total lattice distortion through two factors. First, the fluctuation in charge transfer is a signature of the fluctuation in the Bader volume and the effective atomic size. The mean size and the fluctuation in the atomic displacements increase with an increase in the fluctuation in charge transfer. Second, the charge transfer includes information about the ease of deformation. The large fluctuation in charge transfer implies that some elements have large negative charge transfers (losing electrons) and are easily displaced. As a consequence, the increase in the fluctuation in charge transfer leads to the increase in the total lattice distortion, which may be the origin of the weak proportional relationship between the electronegativity difference and mean square atomic displacement (MSAD) in 3d CCAs ( Fig. 10 b) . However, note that this statement does not guarantee that the total lattice distortion is solely governed by charge transfer, as additional effects such as magnetism exist [5] . Therefore, further investigation is required to rationalize the traditional proposal of the causality between lattice distortion and complexity-induced properties such as elastic strain energy and solid-solution strengthening.

### Effects of SRO on strengthening in 3d CCAs

The present findings help interpret the effects of SRO on mechanical properties. It has been suggested that SRO has a significant impact on stacking fault energies [56] and various strengthening mechanisms [ 52 , 57 , 58 ] (i.e., mainly antiphase boundary strengthening, coherency strengthening, and solid-solution strengthening), which together alter dislocation plasticity [56] and complicate the investigation of the role of SRO in the plastic deformation mechanisms. The lesser effects of SRO on charge transfer and total lattice distortion in 3d CCAs (less than 10% with completely ordered Cr-L1 2 structure) indicate that the change in the solid-solution strengthening by the formation of SRO may be small (less than 1/10 of the solid-solution strength of a random structure, a few tens MPa) in 3d CCAs. Further, this study considers the partially ordered Cr-L1 2 structure as a hypothetical limit of SRO, but real alloys have much less SRO; the small structural changes due to SRO are even more diluted in real 3d CCAs. Indeed, both the standard deviation of the electronegativity values of the constituent elements and the standard deviation of the atomic-level pressure values of the atoms, assuming random configuration, have good proportional relationships with experimentally measured solid-solution strengths in 3d CCAs [14] . Thus, the existence of SRO in 3d CCAs has no significant effect on the solidsolution strengthening due to the low sensitivity of charge transfer to the local structure. In this study, we fix the lattice parameter for the calculation of the Cr-L1 2 structure. In reality, however, the lattice parameters of local SRO clusters vary [52] , which can generate coherency strengthening effects. Furthermore, low Gibbs energies of SROs can cause diffuse antiphase boundary energies and result in antiphase boundary strengthening [ 52 , 57 , 58 ] ; see Fig. 6 c as an example. We thus expect that these two mechanisms could be the dominant strengthening mechanisms of SRO in 3d CCAs. Thus, the similarity among ELLD, total lattice distortion, and charge transfer between A1 and Cr-L1 2 structures implies the less effect of SRO on solid-solution strengthening, which reduces the complexity of understanding the impact of SRO on the mechanical behaviors of 3d CCAs.

### Outlook: Charge transfer, ELLD, and properties of 3d CCAs

The term "lattice distortion" has been often employed to explain interesting properties in CCAs and HEAs. However, the importance of the electronic contributions to both structure and properties has to be recognized when we discuss lattice distortion for such a purpose because the effects of lattice distortion on properties are controlled strongly by the electronic effects in CCAs. In this article, we show that ELLD is an observable signature of charge transfer, and leads to the knowledge of the effective atomic size in 3d CCAs. This new linkage will facilitate understanding how the local structure controls the properties of CCAs, using experimentally observable structural information. Therefore, we suggest reexamining the classical relationship between atomic structure and properties in 3d CCAs based upon the intrinsic atomic size, such as the Goldschmidt radius.

### Conclusions

In summary, we show that the ELLD in 3d CCAs is highly dependent upon local charge transfer between different elements and between different orbitals of the same atom. The ELLD reflects the degree of atomic displacement upon local environmental fluctuations. Charge transfer affects the ease of radial and axial atomic displacements through inter-and intra-atomic charge transfers. The ELLD is the principal factor that determines the ease of atomic displacement, even though factors other than charge transfer may exist in other types of CCAs, for instance, covalent bonding in Alcontaining CCAs. Thus, we suggest that the ELLD can be used as the general qualitative measure of the effective atomic size to predict the contribution of element-specific properties to macroscopic properties of CCAs. Our findings on the correlation among the electronic effects (primarily charge transfer), local energy-related parameters (atomic-level pressure, orbital transfer), atomic structure (ELLD), and related properties will pave the way toward quantitative and well-targeted design of CCAs with improved control of atomic configurations by atomic-level complexity engineering.


==================================

## Paper 2

### Title

Equilibrium Macroscopic Structure Revisited from Spatial Constraint

### Authors

Yuge Koretaka

### Abstract

N/A

### Journal

J. Phys. Soc. Jpn.

### DOI

10.7566/jpsj.85.024802

### Date

2016/1/12

### Subject

General Physics and Astronomy

### Introduction

Consider a classical system, where total energy (E) is the sum of kinetic energy (K) and potential energy (U) that is a function of positions for constituents. In equilibrium state, macroscopic structure can be uniquely specified when we define a complete set of coordination (i.e., corresponding complete orthonormal basis functions), fq 1 ; . . . ; q g g. Statistical physics tells us that Q r , macroscopic structure along a chosen coordination of q r , can be typically given by canonical average:

### Derivation and Concept

It is known from the equipartition theorem that canonical average for kinetic energy in classical systems can be determined from temperature. Therefore, to determine equilibrium macroscopic structure, we first focus on microscopic states on configuration space. Treatment for momentum space is discussed later. In classical systems, potential energy for any microscopic state d on configuration space can be expressed by a linear combination of complete basis functions:

### Applications and Discussions

We first demonstrate validity and applicability of Eq. 2to practical systems, which is compared with a full thermodynamic simulation using multibody interactions with canonical MC simulation. We here consider substitutional crystalline solids, whose spatial constraint (i.e., crystal lattice) is much stronger than liquid or gas. We employ generalized Ising model 16) providing a set of complete orthonormal basis functions to describe possible microscopic structures, where for instance occupation of a chosen lattice site i is specified by Ising-like spin, i ¼ þ1 for A and i ¼ À1 for B in A-B binary system. Under this definition, Eq. (3) can be explicitly written by

### Conclusions

We demonstrate that equilibrium macroscopic structures in disordered states, depending on temperature and on multibody interactions, can be well-characterized by a single special microscopic structure, independent of temperature and on interactions. This fact is naturally derived by clarifying how spatial constraint on the system connects with macroscopic structures in equilibrium state. In practical applications, we show that the present findings not only provide efficient and systematic prediction of equilibrium macroscopic structures over possible combination of constituent elements, but also enable unique and accurate prediction of multibody interactions from measured macroscopic structures, without trial-and-error simulation.


==================================

## Paper 3

### Title

Estimation of Macroscopic Physical Property in Disordered States: Special Microscopic States Approach

### Authors

Yuge Koretaka

### Abstract

N/A

### Journal

J. Phys. Soc. Jpn.

### DOI

10.7566/jpsj.84.084801

### Date

2015/7/29

### Subject

General Physics and Astronomy

### Introduction

In classical statistical thermodynamics, expected value of macroscopic property, C, for equilibrium system can be typically obtained by canonical average of

### Derivation and Concept of the Theoretical Approach

Let us start from rewriting Eq. (1) as

### Application to the Practical Systems

In order to practically obtain the special states for given lattice, we show example to search minimal number of special states in A-B binary system at equiatomic composition on fcc lattice. The special states can contain information of any type of figure (i.e., short as well as long range correlations) when a set of values for basis functions satisfies the above conditions. We here perform MC simulation to minimize difference of basis functions between simulated values of f ðMCÞ k g and ideal values of f ð0Þ k g, defined by

### Conclusions

We develop a theoretical approach that enables estimation of macroscopic physical properties for disordered states from information about a few specially selected microscopic states. These special states are independent of temperature as well as constituent elements, which can directly determine the density of states for disordered states in terms of energy and other physical property. The present approach therefore provides efficient and systematic prediction of macroscopic physical properties based on first-principles calculation, where its validity and applicability is confirmed for Pt-Rh binary alloys through prediction of their energy and density, compared with the result by the full thermodynamic approach based on cluster expansion and Monte Carlo simulation.


==================================

## Paper 4

### Title

Can experiment determine the stacking fault energy of metastable alloys?

### Authors

Sun Xun, Lu Song, Xie Ruiwen, An Xianghai, Li Wei, Zhang Tianlong, Liang Chuanxin, Ding Xiangdong, Wang Yunzhi, Zhang Hualei, Vitos Levente

### Abstract

N/A

### Journal

Materials &amp; Design

### DOI

10.1016/j.matdes.2020.109396

### Date

2020/12/9

### Subject

Mechanical Engineering, Mechanics of Materials, General Materials Science

### Introduction

Intrinsic stacking fault (ISF) in face-centered-cubic (fcc) materials is a type of two-dimensional defect which is usually created by the glide of a Shockley partial dislocation during deformation. Immediately, it is related to the nucleation of deformation twins and hexagonal closepacked (hcp) martensite which are generated by collective motions of partials. ISF is also the characteristic structure between the trailing and leading partials in a dissociated a/2 〈110〉 dislocation. From these aspects, the excess formation energy of ISF, i.e., the stacking fault energy (SFE), serves as a significant intrinsic material parameter affecting the dissociation of a/2 < 110> dislocations, twinning as well as martensitic transformation (MT). For example, in pure fcc metals, deformation twinning (DT) is often observed in Ag with a low SFE (measured value 16 ± 2 mJ/m 2 [1] ) but rarely in Al with a very high SFE (measured value~150 ± 40 mJ/m 2 [2] ). In austenitic Fe-Cr-Ni and Fe-Mn steels [3] [4] [5] [6] [7] [8] [9] , an empirical relation between the prevalent deformation mode and the size of the measured SFE is established, showing that in addition to dislocation slips, low-SFE alloys (<~20 mJ/m 2 ) prefer deformationinduced martensitic transformations (DIMTs) from fcc (γ) to hcp (ε) or to body-centered-tetragonal (bct, α') phases, while medium-SFEs (~20-40 mJ/m 2 ) prefer DT [3, 6, 8, 10, 11] . In materials with high SFEs, usually only dislocation slips can be observed under normal loading conditions [11] . The occurrence of DT or MT during plastic deformation provides important internal boundaries that interact with dislocations in distinct ways from grain boundaries [12] , which enables the socalled dynamical Hall-Petch effect, maintaining the high workhardening rate and thereby delaying the onset of plastic instability and necking [13, 14] . The resulting twinning-induced plasticity (TWIP) and transformation-induced plasticity (TRIP) are two important mechanisms responsible for the excellent plastic properties of high-Mn austenitic steels [3, 4, [6] [7] [8] as well as some multicomponent solid solutions (also called medium-or high-entropy alloys, MEAs/HEAs) such as CrCoNi and CrMnFeCoNi [15] [16] [17] [18] [19] [20] . Therefore, in the development of high-strength alloys, significant effort has been put to study factors that may affect the SFE, such as temperature [9, [21] [22] [23] [24] , composition [10, 21, 25 ] and short-range order (SRO) [26] [27] [28] [29] [30] [31] ; to understand the microscopic mechanisms underlying the role of SFE in DT, MT and dislocation planar slip [4, 7, 10, [32] [33] [34] [35] ; as well as to quantitatively predict the critical twinning stress based on the SFE [3, 18, 34, [36] [37] [38] [39] [40] [41] or the generalized SFE (γ-surface) [42] [43] [44] . All these activities depend on the accurate determination of the SFE. Nowadays, both experimental [45] [46] [47] and computational methods [42, [48] [49] [50] [51] [52] are commonly applied to evaluate the SFEs. Particularly, ab initio methods based on density functional theory (DFT) calculations have been widely adopted to determine the SFE at 0 K, as well as at elevated temperatures via considering contributions from thermal lattice expansion and electronic/phononic/magnetic excitations [23, [53] [54] [55] [56] . For pure fcc metals, a satisfying agreement between experimental and ab initio results has been reached for both the SFE values and the variation trends with respect to temperature [48, 53, 54] . However, the situation becomes more complicated for some alloys, especially the concentrated ones. For example, in Cu-Al alloys ab initio calculations showed that the SFE decreases approximately linearly with increasing Al concentration and turns to be negative at~10 at.% Al [48, 57] ; whereas the experimentally determined values first decrease and then become constant at~5 mJ/m 2 for Al concentration higher than 10 at.% [22] . Similar observation can be made for Ni-Co alloys with respect to Co concentration [21, 22, [58] [59] [60] . It seems that the temperature effect cannot systematically improve the agreement between the theoretical calculations and experimental measurements of SFEs in pure metals (or dilute alloys) and concentrated alloys. Recently, in the development of HEAs, the experimental and theoretical SFEs often have opposite signs (see Table 1 ), which cannot be ascribed solely to the inappropriate treatment of the temperature effect in ab initio calculations [13, 15, 17, 26, [61] [62] [63] [64] [65] [66] [67] [68] . Further efforts to resolve the problem including the consideration of SRO or local chemical variations have been made. For instance, atomistic studies demonstrated that the SFE depends on the local chemical composition as well as chemical and magnetic SROs [26] [27] [28] [29] [30] [31] . Ding et al. [26] reported that the calculated mean SFE of CrCoNi MEA increases markedly from −42.9 mJ/m 2 at the fully random state (estimated through averaging the SFEs of 108 configurations with a broad distribution from −140 to 65 mJ/m 2 ) to~30 mJ/m 2 with increasing the degree of SRO, in comparison to the experimental values, 22 ± 4 [61] and 18 ± 4 mJ/m 2 [17] . Thereby, the authors ascribed the discrepancy in the SFEs in these multicomponent alloys to the SROs. Li et al. [28] further argued that the wide variety of local chemical ordering produces a wide range of generalized stacking fault energies, therefore, increasing the ruggedness of the energy landscape for dislocation activities and influencing the selection of dislocation pathways in slip, faulting and twinning. Being aware of the difficulties of experimental methods in characterizing SROs, recent experiments have found that in the homogenized CrCoNi specimens, SRO (or local chemical variation) is however very weak, if not absent [62, 69, 70] ; only by aging the homogenized CrCoNi MEA at 1000°C for 120 h followed by furnace cooling, Zhang et al. [62] reported observation of SRO domains of~1 nm and that the measured SFE based on partial separation distance increases from 8.18 ± 1.43 mJ/m 2 for the water-quenched sample to 23.33 ± 4.31 mJ/m 2 for the annealed one. Therefore, the discrepancy in the theoretical and experimental SFEs is not solved in CrCoNi MEA, neither in other HEAs. Additionally, one may notice the different experimental SFE values for the homogenized CrCoNi MEA in different Refs. [17, 61, 62] , despite that they are all based on transmission electron microscopy (TEM) measurement of stacking fault width (SFW), which was also ascribed to the inherent local chemical variations in these alloys [29] . Smith et al. [29] found large variations in dislocation dissociation distances through analyzing the measured results for 30 different a/ 2 < 110>{111} 60°mixed dislocations in the CrMnFeCoNi HEA. The average separation distance was 4.82 nm (~5.5 nm [13] ) but with a large range of variation (±3.4 nm), an order of magnitude higher than the normal variation (±0.45 nm) in pure fcc metals [29] . No evidence of alloying element segregation or ordering was found in the alloy [70] , but the large variations in dislocation separations were still ascribed to the local chemical inhomogeneity. It is however not clear how the local composition inhomogeneity or SROs, if exist, in the length scales of~1 nm or less [26, 62, 69] affect the behaviors of dislocations with significantly longer lengths and larger separation widths in the processes of faulting or twinning.

### Methodology

All DFT calculations were performed using the exact muffin-tin orbitals (EMTO) method [72] in combination with the single-site coherent potential approximation (CPA) [73] . The computational package can be found on the EMTO website [74] . Both the self-consistent calculations and total energies were calculated within the Perdew-Burke-Ernzerholf (PBE) exchange-correlation functional [75] . The scalar-relativistic approximation and soft-core scheme were adopted to solve the one-electron Kohn-Sham equations. The Green's function was calculated self-consistently for 16 complex energy points. We employed an l-cutoff of 8 in the one-center expansion of the fullcharge density. The paramagnetic (PM) state was described by the disordered local magnetic moment (DLM) model [76, 77] . The 9 × 18 × 2 k-point mesh was used for all supercell calculations after careful tests. A careful assessment of the present method for the determination of the SFE in fcc metals and alloys can be found in Ref. [48] . The SFEs were calculated using supercells formed by 12 closepacked {111} layers. The intrinsic stacking fault (ABC|BCABC) is formed when a layer of atoms is removed from a perfect fcc sequence (ABCABCABC) [47] . The SFE was computed as SFE = (F fault -F 0 )/A, where F fault and F 0 are the free energies with and without a stacking fault, respectively, and A is the stacking fault area. In the previous works [42, 48, 56] , this supercell method was successfully used to calculate the SFEs of pure metals and solid solutions. The free energies were approximated as F = E-TS mag , where T is the temperature, and E is the internal energy. The magnetic entropy S mag = k B ∑ i=1 n c i ln (1 + μ i ) was calculated within the mean-field approximation, where k B is the Boltzmann constant, n is the total number of elements, c i and μ i are the concentration and local magnetic moment for the ith alloying element, respectively. To partly include the room temperature (RT) effect on the SFE, we used the experimental lattice parameters measured [61, 64, 78, 79] at RT or obtained by a regression formula [78] . Electronic and explicitly anharmonic phonon contributions were estimated to be small at RT and they were neglected [80] , which however does not affect the discussions in the present work. For more details regarding the treatment of the temperature effect on the SFE calculation and the corresponding errors, readers are referred to Refs. [53, 54, 81, 82] .

### Limitations of experimental methods for SFE determination

SFE is usually considered as an experimentally accessible parameter by means of TEM, X-ray or neutron diffractions. In the following, we discuss the limitations of the experimental methods for determining the SFE, especially in metastable alloys. Methods involving TEM measure the distance (d) between the two a/6 〈112〉 partial dislocations in a dissociated a/2 < 110> dislocation [45] or the radii describing the size of the dislocation node [46] , and then one connects these parameters to the SFE. In order to minimize the interaction between dislocations, the partial separation width d is usually measured on an isolated straight dislocation line at its equilibrium state, then the SFE is calculated according to

### Correlations between ab initio SFE, ΔG γ→ε , and experimental SFE

In Fig. 2(a) , we compare γ isf DFT and 2ΔG γ→ε /A, both calculated by DFT method for various fcc metals and alloys. The two quantities correlate nicely with each other, as described in Eq. 2, even when SROs are present (points connected by lines) [26] . The observation is consistent with the previous studies [26, 48, 97, 99] . The strain energy contribution is not included in the calculations, therefore, the deviation between the two quantities gives the interfacial energy term (2σ ε∕γ ). σ ε∕γ is estimated in the range of -9~8 mJ/m 2 for the studied metals and alloys shown in Fig. 2(a) , which is in agreement with the previous values calculated by DFT methods [90] . In Fig. 2(b) , we compare the SFEs obtained by DFT (γ isf

### DFT

) and by experiments (γ isf Expt.

### Correlation between ab initio SFE and deformation mechanism

As we introduced in the Introduction, the occurrence of DT or γ → ε DIMT is usually rationalized with the sizes of the experimental SFEs. Being aware of the limitations of the experimental methods in determining the SFE, instead, here we may establish the relationship between the ab initio SFE and the deformation mode. In Fig. 3 , we demonstrate the correlation between γ isf DFT and the observed prevalent deformation mechanisms [61, 64, [115] [116] [117] in a group of MEAs and HEAs. We emphasize here that despite of the significant complexity of the compositions of these multicomponent alloys, the calculated γ isf DFT acts as a reliable indicator for the activation of the primary deformation mechanisms. Compared to the experimental SFEs (usually available for TWIP, but not for TRIP alloys due to the fact that a large amount of wide SFs exist already at very small strains, which prevents meaningful measurements of partial separation width), the ab initio SFEs have a better resolution in indicating the twinnability or the tendency to DIMT. It becomes even more striking if one includes the results of binary alloys (e.g., Cu-Al) from Fig. 2 . For all the studied alloys, the γ isf DFT s are negative at room temperature, suggesting the metastable nature of these alloys. There seems a critical value or transition region of γ isf DFT at around −20 mJ/m 2 corresponding approximately to the case of CrCoNi MEA, that separates the observed primary deformation mechanisms and the operation of the TWIP and TRIP effects. The microscopic mechanism for this observation is discussed in a separate work [118] . We should mention here that although DT is the dominated mechanism in the CrCoNi MEA, small amounts of hcp martensite has indeed been observed during deformation [119] [120] [121] . both DT and MT are expected from the nice correlation in Fig. 3 , although only the MT was reported from the electron backscatter diffraction (EBSD) results [117] , which is likely due to the limited resolution of the EBSD images.

### Implications of negative SFE

In the following, we discuss some further implications of the negative SFE.

### Interfacial energy σ ε∕γ

One should be extremely cautious to determine the interfacial energy by subtracting the ΔG γ→ε contribution from the measured SFE [5, 89] . Since experimentally there is no direct method for measuring the interfacial energy, Olson and Cohen [5] originally proposed that the interfacial energy σ ε∕γ can be determined via the measured SFE subtracted by the contribution from Gibbs free energy difference ΔG γ→ε , i.e., σ ε∕γ ¼ s of Fe-Cr-Ni alloys were measured by the extended node method [5, 86, 123] at different temperatures. The interfacial energies σ ε∕γ s of Fe-Cr-Ni alloys were accordingly determined to be~10-15 mJ/m 2 , which were later on widely adopted in the SFE calculations using the thermodynamic approaches [5] . In light of our above discussions, since the measured SFE decreases toward a small positive value with decreasing ΔG γ→ε , the obtained interfacial energy in this way will increase by the similar magnitude as the decrease in the ΔG γ→ε (Fig. 2(c) ), as obtained in Ref. [89] , which is an artificial effect. The obtained large interfacial energy does not describe the real energetics of the hcp/fcc interface. There are efforts to calculate the composition dependent SFE based on thermodynamic descriptions of ΔG γ→ε for the purpose to design TRIP/TWIP alloys, while the interfacial energy term is commonly treated as a fitting parameter to realize the agreement between the calculated SFE and the γ isf Expt. [50, 51, 89, 124] . In these cases, the γ isf Expt. values adopted to derive the interfacial energy become critical. A large interfacial energy can effectively wash out the important information carried by ΔG γ→ε .

### 3.4.2.

Effect of negative SFE on the mobility of partial dislocations with respect to altering temperature or stress Negative SFE is important for understanding the temperature effect on the partial separation width, for the purpose to determine the temperature effect on the SFE [84, 95, 125] . Usually in pure fcc metals and dilute alloys, the temperature induced variation of the SFW is fully reversible. But in concentrated alloys such as in Ag-Al [125] , Cu-Al [95] , Co-Ni [84] and Co-Cr-Ni [84] alloys, below a certain temperature T 0 the SFW does not change with temperature. Above T 0 , partial dislocation can move reversibly as the temperature changes. The irreversible variation in the SFW is usually ascribed to factors like SRO, Suzuki effect, and solute impedance effect, but no consensus has been arrived [84, 95, 125] . However, in accordance with the negative SFE, we can understand the above observations better. For example, in Cu-13 at. % Al, it was observed that dissociated dislocations generated at room temperature deformation maintain their separation widths unchanged when altering temperature between 77 K and 450 K [95] . According to our previous study, this alloy has a negative SFE at room temperature [48] and a positive temperature dependence [95] . Decreasing the temperature from room temperature, the SFE becomes more negative (~− 15 mJ/m 2 [48] ), but not smaller enough (together with the repulsive force, Fig. 1(b) ) to overcome the lattice friction and push the partials to move, otherwise, thermally induced martensitic phase transformation is expected. When increasing temperature below T 0 , the SFE becomes larger but still negative, there is no driving force to shrink the partial separation because both the SFE and F int point outwards the partial pair, thus individual partial dislocations appear locked. Only when the SFE is positive and large enough at temperatures higher than T 0 , the SFE and the repulsive force may compete with each other (and with the friction resistance) and alter the partial separation reversibly with respect to temperature as in pure fcc metals. Note that the friction stress should decrease with increasing temperature, which also contributes to the mobility of partials at high temperatures [126, 127] .

### Conclusions

We have demonstrated that the extant experimental models for SFE calculations are not valid in metastable alloys, which restrict the obtained γ isf Expt. always to be positive. Therefore, the γ isf Expt. values will depart from the true thermodynamic stability of the fcc phase and fail to serve as a proper indicator for the activation of the underlying deformation mechanisms in metastable alloys. On the contrary, the SFEs calculated by DFT methods show nice correlation with the Gibbs energy difference between the fcc and hcp structures in both stable and unstable fcc metals and alloys. We argue that it is of significant importance to embrace the negative SFE for properly understanding dislocation behaviors in metastable systems. Finally, the present work calls for future development of experimental methodologies for measuring the SFE in metastable alloys and a revisit to understand the behaviors of partial dislocations under various deformation conditions in light of the negative SFE.


==================================

## Paper 5

### Title

Grand Projection State: A Single Microscopic State to Determine Free Energy

### Authors

Taikei Tetsuya, Kishimoto Tetsuya, Takeuchi Kazuhito, Yuge Koretaka

### Abstract

N/A

### Journal

J. Phys. Soc. Jpn.

### DOI

10.7566/jpsj.86.114802

### Date

2017/10/19

### Subject

General Physics and Astronomy

### Introduction

In statistical physics, the free energy (F) and dynamical variables (C) can be given by

### Random matrix

In order to confirm the validity of the extension, we first explain the premise of our previous approach, which relies on the fact that the density of states for fq r g on a non-interacting system can be well characterized by a multidimensional Gaussian distribution under a constant composition. The validity of this approximation is further confirmed with a random matrix (RM); we showed in our previous study that the statistical interdependence of q r under a constant composition numerically disappears with increasing system size, even though the basis functions themselves are not statistically interdependent. 21) Therefore, we here demonstrate that such statistical independence of q r holds true under a variable composition, where the composition of constituents can vary while the total number of constituents is kept fixed.

### Grand Projection State (GPS)

We first show the result of our previous study under a constant composition, which provides a simple representation of the canonical average of the basis function q r , Q r , which can be expressed by

### Conclusion

In the present study, we find a special microscopic state, GPS, to characterize the free energy in classical systems. This is derived by extending our previous approach in a canonical ensemble to a grand canonical ensemble, whose validity is confirmed with random matrix. This single special state is theoretically important in describing the free energy, which has not been described by a single state because the free energy depends on all possible microscopic states. Furthermore, since the GPS is independent of the temperature, pressure, and constituent elements, and dependent only on spatial constraint, this state is practically important for estimating the free energy with systematically changing the external field, and constituent elements. The black line denotes the free energy when the density of states can be completely given by a multidimensional Gaussian distribution. Red and blue lines denote free energy when the density of states is slightly derived multidimensional Gaussian distribution, respectively measured from A-rich and B-rich system; in other words, measured from E Proj comp+ and E Proj compÀ . The green line shows that the two representations of the free energy reveal the phase separation between disordered states. m Á P x is the number of times sampled at composition x. Therefore, to prepare a matrix from the local system, we set the atom m Á P x times under composition x, and carry out a MC simulation. In this setting, we can consider the local composition fluctuation of a large system.

### A.2 Analytical representation of GPS

In this section, we show that the GPS can be represented without any simulation at the thermodynamical limit. First, the average of q r is a function of the composition, q r ¼ ð2x A À 1Þ n p , 24, 25) where n p is the number of lattice points per cluster. The probability of the composition P x is also given by a binomial distribution, leading to a Gaussian distribution;

### Appendix B: Another Projection State

In Ref. 20 , we successfully introduced the concept of the projection state and energy;


==================================

## Paper 6

### Title

Lattice Distortions in the FeCoNiCrMn High Entropy Alloy Studied by Theory and Experiment

### Authors

Oh Hyun, Ma Duancheng, Leyson Gerard, Grabowski Blazej, Park Eun, Körmann Fritz, Raabe Dierk

### Abstract

N/A

### Journal

Entropy

### DOI

10.3390/e18090321

### Date

2016/9/2

### Subject

General Physics and Astronomy

### Introduction

High configurational entropy, sluggish diffusion, the cocktail effect and lattice distortions constitute the four main features, also referred to as core effects, characterizing the broad class of multi-principal element solid solution alloys known as high entropy alloys (HEAs) [1] [2] [3] . The term cocktail effect refers to the fact that some properties (e.g., mechanical or magnetic ones) cannot be approximated from linear interactions among the different elements and phases. This class of alloys has attracted a lot of attention due to promising mechanical [4] [5] [6] [7] [8] , electric [9, 10] and magnetic properties [11, 12] . The core effects have originally been assumed to be responsible for the excellent properties of HEAs. Recently, it was shown, however, that the efficiency and relevance of the core effects need to be critically examined for each specific system under consideration. For example, in the FeCoNiCrMn alloy, other entropy contributions, i.e., lattice vibrations, electrons and magnetism, were shown to be of similar importance as the configurational entropy [13] .

### Materials and Methods

The FeCoNiCrMn HEA was cast in a vacuum induction furnace using metallurgical ingredients above 99.8 wt % purity. To remove artifacts, such as pores or elemental segregation, as well as to enhance the overall quality of the homogenized sample, the as-cast ingot was hot rolled at 900 • C with a rolling reduction ratio of 50%, followed by homogenization at 1200 Recent findings showed phase decomposition in the FeCoNiCrMn alloy [29] , and we, therefore, probed the compositional homogeneity at the atomic scale using atom probe tomography (LEAP 5000 XS, Cameca Inc., Düsseldorf, Germany) to verify a single-phase solid solution in the present samples. The results shown in Figure 1 reveal no indication of any compositional decomposition on the nm-scale. The normalized homogenization parameter µ obtained by a frequency distribution analysis is close to 0 for all five elements (not shown), revealing a random distribution of the involved elements in the present alloy. This is a direct consequence of our sample preparation and the sufficiently high enough temperatures chosen for homogenization. X-ray absorption measurements were carried out on the 7D beamline of the Pohang Accelerator Laboratory (PLS-II, 3.0 GeV, Pohang, Korea). The X-ray absorption spectra for Cr, Mn, Fe, Co and Ni were taken in a transmission mode under a He atmosphere. Higher-order harmonic rejection was achieved by detuning the Si(111) monochromator crystals to 15%-30% for each element edge. The beam size was 1.5 × 4 mm in the horizontal and vertical directions to include more than 100 grains for uniformity. The X-ray absorption spectra for Cr, Mn, Fe, Co and Ni were taken in a transmission mode under ambient conditions. All element foils were measured as a reference to calibrate for any inconsistency in the energy shifts during the data collection. The obtained datasets were properly aligned and processed using the program Athena in the IFEFFIT 1.2.11d suite of software programs [30] . The smooth pre-edge function has been removed by linear extrapolation to avoid instrumental background and absorption from other edges [31] . The resulting element-resolved absorption µ(E) was afterwards normalized by using atomic-like absorption profiles. Careful fits to the measured data were carried out using the Artemis program included in the IFEFFIT software package. The fitted data for the first single scattering path included photoelectron waves with wave numbers of 3-10.5 Å −1 and interatomic distances of 1-3 Å for each element (Cr, Mn, Fe, Co, Ni).

### Results and Discussion

The concept of computing element-specific lattice distortions is illustrated in Figure 2 . From the different SQS supercell realizations, we extracted 1500 individual element-specific bonds for each of the five constituents. We considered an undistorted, ideal FCC lattice as the reference structure to quantify the experimentally-, as well as the theoretically-extracted bond length variations. As an example, Figure 2a indicates a few of the bonds for Mn for a specific SQS supercell, and Figure 2b shows the local bond variation of Mn averaged over all 1500 different bonds. In order to quantify the mean value, as well as the fluctuations (standard deviations), we performed Gaussian fits over the element-resolved data (the black line in Figure 2b) . A direct outcome of the theoretical analysis is the comparably small mean distortion (<1%) compared to the fluctuation (standard deviation) of the individual bond lengths, which can be in the order of a few percent. The same analysis has been carried out for all individual elements. The bond distortion distributions are shown in Figure 3a -e, revealing the strongest variation for Cr and Mn. In Figure 3f -o, we also show the mean values of the bond distributions and the corresponding standard deviations versus mean bond length. This allows us to reveal the impact of volumetric changes, which could arise from temperature or pressure variations. The theoretical mean values in Figure 3f (Figure 3k-o) and experimental data (red error bars in Figure 3f-j) is consistently found for Cr and Mn. Note that the overall magnitude of the local bond fluctuations quantified by the standard deviations in Figure 3k -o is almost an order of magnitude larger than the corresponding mean averaged distortions. They are also much larger than the actual deviation between theory and experiment for the mean averaged distortions. For example, the largest deviation between theory and experiment is found for the mean bond distortions of Mn (shown in Figure 3j ). However, comparing in Figure 2b the peak of the Gaussian fit (black solid line) and the EXAFS data (red dashed line) with the fluctuations indicated by the standard deviation relativizes the seemingly large deviation of the mean values. Note that at room temperature, harmonic thermal excitations (phonons), which are not considered in our current theoretical framework, can further broaden the resulting bond length distribution, but will not significantly affect the derived mean bond lengths which are compared to the experiment. Further analyzing the theoretical volume-dependent data shown in Figure 3f -o reveals that the mean distortions are rather robust with respect to changes in volume. However, this is in contrast to the standard deviations revealing a strong volume dependence. This indicates a sensitive interplay between temperature or pressure induced volume changes and local bond fluctuations. Overall a good agreement between the theoretical and experimental data is found. In all cases, the standard deviation of the local bond lengths σ b is about an order of magnitude greater than the mean difference between the local bond length and the global average bond length ∆b. This observation has great implications for the solute strengthening mechanism in HEAs. A full derivation of the solute strengthening model in systems with fluctuating misfit volumes is beyond the scope of this work, but the relative importance of the σ b can be seen by examining how it affects the fluctuation in solute-dislocation interaction energy. This term is closely related to Labusch-type strengthening [14, 15] .

### Conclusions

Element-resolved local distortions have been investigated in fcc FeCoNiCrMn combining EXAFS measurements and electronic structure calculations. Good agreement between the experimental and theoretical data is found for the element-resolved mean lattice distortions. These turned out to be relatively small (∼0.1%), explaining the recent success of theoretical simulations assuming undistorted perfect lattices.


==================================

## Paper 7

### Title

Atomic displacement in the CrMnFeCoNi high-entropy alloy – A scaling factor to predict solid solution strengthening

### Authors

Okamoto Norihiko L., Yuge Koretaka, Tanaka Katsushi, Inui Haruyuki, George Easo P.

### Abstract

N/A

### Journal

AIP Advances

### DOI

10.1063/1.4971371

### Date

2016/12/6

### Subject

General Physics and Astronomy

### 125008-6

Okamoto et al.

### SUPPLEMENTARY MATERIAL

See supplementary material for details of sample preparation, synchrotron X-ray diffraction and first-principles calculations. Figures S1-S3 and Tables S1-S5 of the supplementary material are also provided.


==================================

## Paper 8

### Title

Dislocation mechanisms and 3D twin architectures generate exceptional strength-ductility-toughness combination in CrCoNi medium-entropy alloy

### Authors

Zhang Zijiao, Sheng Hongwei, Wang Zhangjie, Gludovatz Bernd, Zhang Ze, George Easo P., Yu Qian, Mao Scott X., Ritchie Robert O.

### Abstract

<jats:title>Abstract</jats:title><jats:p>Combinations of high strength and ductility are hard to attain in metals. Exceptions include materials exhibiting twinning-induced plasticity. To understand how the strength-ductility trade-off can be defeated, we apply <jats:italic>in situ</jats:italic>, and aberration-corrected scanning, transmission electron microscopy to examine deformation mechanisms in the medium-entropy alloy CrCoNi that exhibits one of the highest combinations of strength, ductility and toughness on record. <jats:italic>Ab initio</jats:italic> modelling suggests that it has negative stacking-fault energy at 0K and high propensity for twinning. With deformation we find that a three-dimensional (3D) hierarchical twin network forms from the activation of three twinning systems. This serves a dual function: conventional twin-boundary (TB) strengthening from blockage of dislocations impinging on TBs, coupled with the 3D twin network which offers pathways for dislocation glide along, and cross-slip between, intersecting TB-matrix interfaces. The stable twin architecture is not disrupted by interfacial dislocation glide, serving as a continuous source of strength, ductility and toughness.</jats:p>

### Journal

Nat Commun

### DOI

10.1038/ncomms14390

### Date

2017/2/20

### Subject

General Physics and Astronomy, General Biochemistry, Genetics and Molecular Biology, General Chemistry, Multidisciplinary

### S

trength and ductility (and hence toughness) are key mechanical properties of structural materials [1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11] [12] [13] [14] , although these properties are often mutually exclusive 15 . In crystalline metallic materials, strength and ductility depend on the presence of crystal defects and how they move under mechanical loading. Dislocations serve as the prime carrier of plasticity in metals and their motion to create plastic deformation is strongly influenced by interactions with other dislocations as well as defects such as solute atoms 14, [16] [17] [18] [19] [20] , stacking faults 21, 22 , grain boundaries (GBs) [23] [24] [25] and reinforcement particles or precipitates 26, 27 . In general, strong interactions (obstacles) strengthen a material although this often limits its ability to plastically deform. Twinning, however, appears to be a deformation mechanism capable of defeating this 'conflict' between strength and ductility [1] [2] [3] [4] [5] [6] 8, 9, 16, 28, 29 . The presence of twins usually serves to impede dislocation motion and induce strengthening, but multiple twinning systems can also enhance ductility. This is apparent in twinning-induced plasticity (TWIP) steels, which are known to form multiple types of twins that result in high strength with substantial uniform ductility 6, [10] [11] [12] . Another notable example includes certain equiatomic multielement alloys, termed high-entropy alloys 30 (HEAs), based on the CrMnFeCoNi composition that have a single-phase facecentered cubic structure (fcc) structure 31, 32 with relatively low-stacking-fault energies (SFEs), comparable with 304 stainless steels 33 and relatively large separations between the Shockley partials 34 . These alloys can display excellent strength 9, 35 , ductility 9, 35 and toughness 1 at room temperature, properties which are further enhanced or maintained at cryogenic temperatures where deformation nano-twinning becomes a more prominent mode of deformation. Despite our recent observations of various toughening mechanisms occurring on the nanometre length-scale in the vicinity of a crack tip in such an alloy 8 , the quantitative strengthening effect from deformation twinning and the nature of twinning-induced plasticity remain somewhat uncertain.

### Results

Numerical simulations. DFT-based ab initio calculations were performed to compute the formation energy of the equiatomic CrCoNi alloy with different crystal structures as well as their planar fault energies. In previous theoretical work 33, 43, 44 , the formation energies of medium-and high-entropy alloys were treated with the coherent potential approximation (CPA) 44, 45 or the special quasi-random structure (SQS) 46 method in conjunction with ab initio treatments. In this study, the formation energies of CrCoNi crystals were explicitly assessed with the 'multiple randomly populated supercell' approach. The configurational dependence of the formation energy of CrCoNi MEAs is shown in Supplementary Fig. 1 . In our calculations, atoms of the different elements comprising the MEA were randomly assigned to the lattice points of the corresponding crystal structure, followed by geometrical optimization to obtain the ground state configuration of each structure. Although computationally demanding, this approach gives us an advantage by allowing direct evaluation of the stacking-fault energies and their formation energy barriers.

### along the 11 2

h i direction results in a two-layer stacking fault (Fig. 1c) , which is called an extrinsic stacking fault (ABCABC|B|ABCAB). Further shifting of the fault in Fig. 1c leads to a three-layer fault, shown in Fig. 1d and so on. As such, continued shifting of the crystal will create a twinned structure with a twin boundary. The calculated energies of the intrinsic stacking fault, g isf , and twin boundary, g TB , are given in Table 1 . The energy g us is that of the unstable stacking fault, and g ut is the nucleation energy barrier for the formation of twin boundaries (Fig. 1f) .

### Discussion

On the basis of the in situ straining of the CrCoNi, we have found that a three-dimensional hierarchical twin network is established within individual grains in this MEA, associated with its very low (negative) stacking-fault energy calculated at 0 K; this network presents substantial barriers for dislocation motion, and contributes to its high strength and significant strain hardening. However, at the same time, the network provides multiple pathways for the easy motion of dislocations, which permits the simultaneous generation of significant plastic deformation. Importantly, the formation of the 3D twin network is achieved within relatively large grains (B5-50 mm in size 8 ), and is found to be stable against de-twinning as deformation continues with the twin-boundary interfaces serving as pathways for dislocation slip. This observation is significantly different from that previously reported in twinning-deformation dominated materials 3, 4, 6, 7, 64 . As a result, high strength coupled with high ductility and continuous strain hardening is achieved in this alloy, which presents the perfect ingredients for its exceptionally high fracture toughness 8 . As lower (cryogenic) temperatures serve to elevate the strength and hence are expected to further promote twinning activity, the damage tolerance (strength with toughness) of this alloy is destined to be enhanced at such low temperatures, which is exactly what has been observed experimentally 8 . This dual effect on dislocation activity is a consequence of the three-dimensional hierarchical twinning architecture that is generated with plastic strain, which in turn results from the high twinnability of this particular alloy.

### Methods

Materials preparation and microstructural characterization. Samples for this study were extracted from a previously produced nominally equiatomic CrCoNi MEA whose microstructure and mechanical properties were reported in a recent paper 8 where details of its processing and mechanical characterization can be found. Atomic structures were investigated using the aberration-corrected TEAM0.5 transmission electron microscope (operating at 200 kV), housed at the National Center for Electron Microscopy at the Lawrence Berkeley National Laboratory (LBNL), and the in situ compression tests were performed using a Hysitron PI95 nanoindenter in a JEOL 3010 microscope at 300 KV. The nanopillars for the in situ compression tests were produced using focused-ion beam techniques; details of sample preparation and in situ compression have been described in previous studies 65, 66 . The in situ TEM tensile tests were conducted at room temperature using a Gatan model 654 single-tilt straining holder in an FEI Tecnai G2 F20 TEM operating at 200 kV. Roughly 12 samples, thinned by jet polishing and well attached to the substrate, were selected for in situ tensile straining and detailed TEM investigation as described in a previous paper 22 . Time-resolved TEM and HRTEM images of the regions of interest were recorded with a Gatan CCD camera at 10 frames per second.


==================================

## Paper 9

### 1

['(1)']

### NDf

["The ensemble average of a physical property P over configurations (denoted by angular brackets) can be rigorously ' expanded as", '(P) =g Dk, (&~, )p~, k, m', 'where pk ", are the "interaction parameters" of figures f =(k, m) and (IIt, ) are the correlation functions. Ns values of [pt, ] can be determined if Nq values of (P)', 'are available (e.g. , from band theory "). For a perfectly random (R) A~"B"structure, the many-body (k&0) correlation functions are (IIt, )tt (2x -1)"; hence, at', "x = -, ', they vanish to all orders, except Ho~1.", 'The usual approach for simulating properties of random alloys through a finite-N representation of Eq. (2) (e.g. , see Ref. 6 ) assumes that each site should be individually occupied at random by A or B. The extent to which this approach produces a finite-N-atom/cell structure that, as a whole, approaches randomness can be measured by', 'EQUATION', '=~ ( (1) and(2) the error in the property P relative to that in a perfectly random alloy is represented in terms of a hierarchy of distances,', 'EQUATION', 'I,m direction. Using, for example, the criterion that II2~= 0', "and H22+H23+H24 minimum, we also find that the SQS-4 is an Aq82 superlattice along [110] ,while is an 2~8~2282 superlattice along [331]. Table I gives for completeness also SQS-2. Although N 2 is generally too small to represent a random alloy, we find that the CuAuI structure gives the best overall N=2 representation for a random alloy. For each SQS we give in Table  I the absolute value of the correlation functions,~IIt, their departure from zero reflects errors relative to an infinite, perfectly random alloy. It is seen that SQS-8 is an excellent choice, equivalent to N~for the firstand second-neighbor correlation functions (as well as for sixth), to N 64 for third neighbors, etc. Its many-body correlation functions (note shown in Table I ) also exhibit small values; e.g. , the averaged value of H3 0, f14, 1 0, and II4 2 0.167. As a further measure of the accuracy with which the SQS's represent a perfectly random, infinite structure we give in Table I the number (0 ) of mth-order neighbors to a given site that are of the opposite type. In a perfectly random structure (0 ) D~(D~/2) 't . The SQS-8 reproduces this distribution within the standard deviations.", 'Unlike the SCPA or the VCA, the SQS exhibits a dis tribution of local environments of inequivalent A (or 8) atoms; hence, when treated by conventional bandstructure methods one can simply incorporate in them realistic atomic relaxations and charge redistributions.', "Unlike cluster-expansion methods, '' [Eq. (2) l, the SQS approach is capable of depicting directly the electronic charge distribution in a random alloy and does not require evaluation of pk from a truncated expansion. ''", "We have applied self-consistently the local-density formalism, as implemented by the linear augmented-planewave' (LAPW) and nonlocal pseudopotential' bandstructure methods to a range of pseudobinary &p, 58p 5C semiconductor SQS's. Here, the C atoms reside on the nominally common sublattice (so the actual number of atoms per cell is 2N); all A, 8, and C atomic positions are allowed to relax (without atomic interchanges) so as to minimize the total energy. A direct band-structure calculation of the total energy of a structurally relaxed SQS (taken with respect to the energies of the binary constituents AC and BC at equilibrium) approximates the excess energy AH(x -, ' ) of a random alloy. Such direct calculations for SQS-2 and SQS-4 are compared ' in Table II to results obtained by the cluster expansion. Table II shows that a single calculation even on SQS-4 reproduces well, without resorting to statistical calculations, the corresponding results obtained from the full statistical-mechanics simulation: The latter agrees well with measured excess enthalpies. ' For GaPp5Asp5", "and Alp 5Gap 5As we have also calculated, using the pseudopotential method, ' the properties of SQS-2, -4, and -8. For GaPp5Asp5 we find the relaxed mixing enthalpies dH 26. 1, 13.9, and 16.5 meV/(4 atoms) for N-2, 4, and 8, respectively (the experimental value is -18~10 meV). For Alp5Gap5As we find 13.7, 10.5, and 10.5 meV/(4 atoms) showing even more rapid convergence.", 'It is less obvious that band gaps would converge rapidly in Eq. (2). To examine this we have used the pseudopotential calculated direct band gaps [Eg(S)] of Ns ordered structures of Al"Ga As"+, obtaining through Eq.', '(2) the Nq expansion coefficient [pt, ] for P=Eg.', "These were then used to predict Eg for a diferent struc- ' ) at T 800 K and at T~(random alloy) as calculated from an Ising model (Ref. 7), and the observed (expt. I) bowing parameters (Ref. 14) . SQS-4 denotes results obtained after averaging the crystal-field split states at the valence-band maximum. . Using Ns =5, 6, and 7, we predict Eg (SQS-8) =1. 42, 1.34, and 1.37 eV, respectively, showing rather rapid convergence, despite the fact that Eg(S) of the starting structures span a large range, between 0.7 and 2.2 eV. A direct band calculation on SQS-8 gives Eg =1.38 ev, in excellent agreement with the cluster expansion to sixth neighbors (1.37 eV). Additional convergence tests with N, =27, to be published separately, confirm that SQS-8 predicts the gaps for GaAIAs and GaAsP to within -0.05 eV or better. Given this success, we have calculated the relativistic band structures of the SQS's for the seven semiconductor alloys using the LAPW method. Table II gives the optical bowing coefficient b 4IEs( -, ' ) -Es(-2 )] of the direct alloy band gap at composition x -, ' (where Eg denotes the concentration-weighted band gap of the binary constituents; note that due to the difference taken in b, the local-density error cancels to first order). For comparison, we also give the calculated results for the CuPt structure and experimental data' for the disordered alloy. Using the pseudopotential method, we find for GaPo sAso s the crystal-field-averaged bowing coefficient of the direct gap (in eV) of 0.14, 0.19, and 0.19 for SQS-2, -4, and -8, respectively (the experimental value' is 0.21 eV). We see that parameter-free self-consistent calculations on the SQS-N converges well and reproduces the experimental trends. It is important to note that neglect of structural relaxation (as done in VCA and SCPA methods ) leads to huge errors in sizemismatched alloys, e.g. , we find that b(SQS-2) for unrelaxed Ga2SbAs is 0.32 eV, instead of 1.30 eV for the relaxed structure and that hH is 237 meV instead of 115 meV. For GaAsP, AH is 60.2 meV instead of 16.5 meV.", 'As a final demonstration of the usefulness of the SQS concept we quote its recent application\' to the study of the optical properties of the Al~-"Ga"As alloy. We have constructed a periodic model\' of this alloy at the -50%-50% composition by populating randomly a 2304-atom unit cell by Ga and Al (As resides on a separate sublattice). The energy levels were then calculated within a tight-binding Hamiltonian whose matrix elements were fitted to the band structure of GaAs and A1As. A spectral weight analysis of the solutions of the 2304-atom cell produced the alloy band gaps (given in eV, with respect to the valence-band maximum):']


==================================

## Paper 10

### Title

Finding well-optimized special quasirandom structures with decision diagram

### Authors

Shinohara Kohei, Seko Atsuto, Horiyama Takashi, Tanaka Isao

### Abstract

N/A

### Journal

Phys. Rev. Materials

### DOI

10.1103/physrevmaterials.5.113803

### Date

2021/11/29

### Subject

Physics and Astronomy (miscellaneous), General Materials Science

### I. INTRODUCTION

Modeling a perfectly random structure using periodic structures has been performed for several decades to estimate the physical properties of substitutional solid solutions using density functional theory (DFT) calculations. One approach adopts special quasirandom structures (SQSs) [1] , which are periodic structures almost identical to a perfectly random structure in terms of correlation functions. SQSs have been widely used with DFT calculations to estimate physical properties of perfectly random structures such as formation enthalpy [2] [3] [4] [5] , lattice distortion [6, 7] , elastic properties [8] , electronic properties including the band gap [9] [10] [11] , paramagnetic properties [12] [13] [14] [15] , and piezoelectric properties [16] .

### II. TERMINOLOGY

Before we show the details of our algorithm for searching for SQSs, we briefly define the terminology to represent substitutional structures. Figure 1 illustrates the terminology defined in this section with a two-dimensional example. It is straightforward to generalize it to arbitrary dimensions.

### III. FORMULATION OF SEARCHING FOR SQS

We formulate the combinatorial problem to find SQSs as enumerating labelingsc satisfying Boolean constraints. For a given supercell with transformation matrix M, we consider the set of all possible labelings and eliminate labelings by imposing constraints that SQSs should satisfy. Figure 2 shows a schematic diagram of the labeling elimination. Here, we introduce a constraint for eliminating labelings different from the perfectly random structure in terms of the concentration, a constraint for eliminating equivalent labelings in terms of the symmetry of the supercell, and a constraint for eliminating labelings different from the perfectly random structure in terms of correlation functions. We define the set of all possible labelingsC all and the set of possible labelings with the same concentration as the perfectly random structure, C conc , in Sec. III A. In Sec. III B, we then define the set of feasible labelingsC feasible , which are nonequivalent labelings out ofC conc . In Sec. III C, we finally show the set of labelings composed of SQSs,C N c SQS , which are the same as the perfectly random structure in terms of correlation functions.

### A. Concentration

Since the sum of occupation numbers at each site over atom types is one [Eq. (2)], all possible labelings in a k-ary system should belong to the following set:

### B. Derivative structures

Two distinct labelings may represent equivalent structures owing to the symmetry of the supercell. For example, labelings (0, 0, 1, 0, 1, 1) and (0, 1, 1, 0, 0, 1) give equivalent structures in the example of Fig. 1 . Thus, we need to select a representative among the symmetrically equivalent labelings, which we call a nonequivalent labeling. We refer to the corresponding substitutional structures as derivative structures. We define the nonequivalent labeling as the minimum labeling in the lexicographic order among the equivalent labelings [28, 29] : For example, labeling (0, 0, 1, 0, 1, 1) is smaller than (0, 1, 1, 0, 0, 1) in the lexicographic order because the first elements of both labelings are the same and the second element of (0, 0, 1, 0, 1, 1) is smaller than that of (0, 1, 1, 0, 0, 1). We denote the set of lexicographically minimum labelings as C sym .

### C. Correlation function and SQS

SQSs [1, 30] are designed to exhibit the correlation functions of given clusters that are the closest to those of the perfectly random structure. For the perfectly random structure, the correlation function can be determined by its concentration. We denote the correlation function between atom types p and q for the perfectly random structure as

### IV. ZDD

The number of feasible labelings increases exponentially with the index of supercell. To deal with the exponential increase, we introduce an efficient data structure, the ZDD, in Sec. IV A. We represent labelings with a fixed concentration using a ZDD in Sec. IV B. We apply the procedure to represent nonequivalent labelings using the ZDD, which the authors proposed in Ref. [24] . The procedure is summarized in Sec. IV C. Finally, we introduce a procedure to construct a ZDD for representing labelings whose correlation functions are the same as those of the perfectly random structure in Sec. IV D.

### A. Relationship between binary decision tree and ZDD

A binary decision tree [31] represents a family of subsets composed of n elements satisfying given conditions. By fixing the order of choosing each element, we can express the family of subsets as a tree structure. The binary decision tree consists of terminal nodes, nonterminal nodes, and directed edges. The terminal nodes are leaves of the binary decision tree. The two kinds of terminal nodes, called the 1-terminal node and 0-terminal node, indicate whether or not the subset satisfies the given conditions, respectively. Each nonterminal node, which corresponds to one of the n elements, has two outgoing edges, the 1-edge and 0-edge. These edges, respectively, indicate whether or not the corresponding element belongs to a subset. Thus, a path from the root node to the 1-terminal node, called the 1-path, corresponds to a subset satisfying the given conditions.

### B. Concentration

The ZDDs forC conc and C conc can be constructed with a procedure similar to that for constructing a ZDD representing labelings with a fixed concentration, as introduced in Ref. [24] . the binary equiatomic substitutional structures of Fig. 1(b) . The constraint for the equiatomic composition is equivalent to choosing three 1-edges. There are ( 63 ) = 20 1-paths and corresponding equiatomic substitutional structures. In particular, the following 1-path in the ZDD corresponds to the derivative structure shown in Fig. 1(c) ,

### C. Nonequivalent labelings

Recently, the authors have proposed the frontier-based ZDD method for efficiently enumerating derivative structures [24] . The algorithm for eliminating symmetrically equivalent labelings is based on Ref. [34] , in which the enumeration of all nonisomorphic subgraphs of a given graph up to the automorphism was proposed. Figure 4(b) shows the ZDD corresponding to the binary equiatomic derivative structures for the supercell shown in Fig. 1(b) . The derivative structure in Fig. 1(c) corresponds to the following 1-path in the ZDD:

### D. Correlation functions

After the ZDD forC feasible is constructed, we take the intersection between it and a ZDD to represent labelings satisfying the constraint pq α (c) = pq α ,C pq α . This constraint is regarded as a quadratic equation of the labelingc. Because the left-hand side of the equation monotonically increases with each label c i , we can eliminate a partially determined labeling that cannot satisfy the constraint. Moreover, two nodes in a ZDD are merged when partially determined terms of pq α (c) are equal. This ZDD construction for SQSs avoids explicitly listing all labelings and checking their correlation functions one by one because the correlation functions are efficiently examined oñ C feasible . Although the ZDDs for correlation functionsC α and C α are represented by a compressed form of a corresponding binary decision tree, their construction is computationally more expensive than the other ZDDs. Thus, we impose the constraints in terms of correlation functions after constructing the set of feasible labelingsC feasible and C feasible .

### A. Pareto-optimal SQS

We demonstrate applications of the present ZDD-based method for fcc-based and hcp-based SQSs. We show the computational details of the present ZDD-based method. We use SPGLIB [35] and PYMATGEN [36] to obtain symmetrically nonequivalent pair clusters. We choose the c/a ratio to be ideal for the hcp primitive cell. We use TDZDD [37, 38] to implement the frontier-based algorithm for constructing ZDDs.

### SQS for transformation matrix

EQUATION

### By developing C N c

SQS for other transformation matrices with the index of 40, it is revealed that we can find labelings that are the same as the perfectly random structure in terms of all , is ten for SQS-40. If multiple labelings are included in the final set of labelings, we pick up one of the labelings that is the closest to the perfectly random structure in terms of additional triplets or quadruples. The correlation functions for the additional clusters can be calculated by a general procedure without using the ZDD.

### B. Computational performance

We compare the performance of the present ZDD-based method with that of the previous enumeration method implemented in GENSQS in ATAT [42] . The previous method searches for SQSs by explicitly listing all nonequivalent derivative structures with a given index and checking their correlation functions one by one. We measure the runtime of both methods for searching for binary and ternary fcc-based SQSs of AB and ABC. Unlike the ZDD-based method, the previous method needs to fix the range of considered pair clusters beforehand to define the similarity to the perfectly random structure. For a binary system, we limit the range of pair clusters up to the eighth one. For a ternary system, we limit the range of pair clusters up to the fifth one. Although the runtime slightly depends on the choice of the clusters, the following comparison is still useful. The results of these calculations are shown in Fig. 7 . The ZDD-based method improves the base of the exponential runtime to around half that of the previous enumeration method: Hence, the ZDD-based method can find SQSs much faster than the previous method. For example, the runtime for searching for binary SQS-24 with the ZDD is about 3000 times shorter than the previous enumeration method, and the improvement in runtime further increases with a larger index. The improvement in runtime and the decrease in the required amount of memory enable SQSs with larger indices to be found. Thus, the ZDD-based method for searching for SQSs is much more efficient than the previous enumeration method. The stochastic approach for finding SQS is also implemented in ATAT. In Appendix B, we compare the performance of the present ZDD-based method with that of the stochastic method in conjunction with describing their methodological differences.

### C. Application to realistic systems

We apply Pareto-optimal SQSs to estimate the formation energies of fcc-based and hcp-based perfectly random structures with DFT calculations to show the convergence behavior of the formation energies. We select fcc-based SQSs for a Cu-Au-Pd system and hcp-based SQSs for a Hf-Zr-Ti system. In the Cu-Au-Pd system, Cu, Au, and Pd are in the ground state with the fcc structure, and Cu 0.5 Pd 0.5 , Cu 0.5 Au 0.5 , and Au 0.5 Pd 0.5 are fcc-based solid solutions at temperatures of around several hundred degrees, although B2 and L1 0 ordered structures have been reported to exist in the Cu-Pd and Cu-Au systems at low temperatures, respectively [43] . Similarly, in the Hf-Zr-Ti system, Hf, Zr, and Ti are in the ground state with the hcp structure at low temperatures, and Hf 0.5 Ti 0.5 , Hf 0.5 Zr 0.5 , and Zr 0.5 Ti 0.5 are hcp-based solid solutions at low temperatures.

### VI. CONCLUSION

We have presented an efficient ZDD-based algorithm for searching for SQSs, which works for arbitrary lattices. In the current algorithm, ZDDs are sequentially constructed by imposing constraints for extracting SQSs one by one, and the obtained final ZDD represents a set of only SQSs. We have also applied the current ZDD-based algorithm to search for fcc-based and hcp-based SQSs in binary, ternary, and quaternary systems. The current approach extracts only a small number of SQSs from a ZDD composed of many candidate derivative structures (more than 10 12 ). Consequently, we propose SQSs that are better optimized than those proposed in the literature. Therefore, the use of ZDDs significantly improves the efficiency of enumerating derivative structures that satisfy the constraints. Furthermore, the current algorithm and ideas used to introduce constraints are also helpful for the enumeration of feasible structures satisfying some constraints that are not used in this study. 


==================================

## Paper 11

### Title

Efficient<i>Ab initio</i>Modeling of Random Multicomponent Alloys

### Authors

Jiang Chao, Uberuaga Blas P.

### Abstract

N/A

### Journal

Phys. Rev. Lett.

### DOI

10.1103/physrevlett.116.105501

### Date

2016/3/8

### Subject

General Physics and Astronomy


==================================

## Paper 12

### Title

Deep learning framework for material design space exploration using active transfer learning and data augmentation

### Authors

Kim Yongtae, Kim Youngsoo, Yang Charles, Park Kundo, Gu Grace X., Ryu Seunghwa

### Abstract

<jats:title>Abstract</jats:title><jats:p>Neural network-based generative models have been actively investigated as an inverse design method for finding novel materials in a vast design space. However, the applicability of conventional generative models is limited because they cannot access data outside the range of training sets. Advanced generative models that were devised to overcome the limitation also suffer from the weak predictive power on the unseen domain. In this study, we propose a deep neural network-based forward design approach that enables an efficient search for superior materials far beyond the domain of the initial training set. This approach compensates for the weak predictive power of neural networks on an unseen domain through gradual updates of the neural network with active transfer learning and data augmentation methods. We demonstrate the potential of our framework with a grid composite optimization problem that has an astronomical number of possible design configurations. Results show that our proposed framework can provide excellent designs close to the global optima, even with the addition of a very small dataset corresponding to less than 0.5% of the initial training dataset size.</jats:p>

### Journal

npj Comput Mater

### DOI

10.1038/s41524-021-00609-2

### Date

2021/9/23

### Subject

Computer Science Applications, Mechanics of Materials, General Materials Science, Modeling and Simulation

### INTRODUCTION

In order to discover or design novel materials having outstanding properties, significant effort has been paid to devise various material design approaches such as biomimicry, design of experiment methods, and other conventional optimization methods [1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11] [12] [13] . However, these approaches often require in-depth physics-based analysis of the relationship between materials descriptors and properties. Hence, a fundamental understanding on the underlying physical mechanisms determining the material properties is a primer for the material design. Machine learning models are alternative promising tools for materials design, because they enable design space exploration only with a database representing the relationship between the descriptors of material (inputs) and the properties (outputs). Trained machine learning models can infer the relationship with several orders of magnitude speedup compared to actual data generation from experiments or physics-based simulations tools [14] [15] [16] [17] [18] [19] [20] [21] [22] . In many applications, the machine learning models, such as Gaussian process regression, radial basis function network, support vector machine, and deep neural network (DNN), are adopted as surrogate forward models, which predict the outputs from the corresponding inputs [23] [24] [25] . These models are combined with highthroughput screening and various optimization methods to obtain new materials with targeted properties [26] [27] [28] [29] . However, it requires a lot of effort to find desired materials in vast design space with a forward design approach, because a large number of candidates must be tested to search for the optimal material due to the absence of the gradient of predicted output with respect to input features 19, [30] [31] [32] .

### Schematic of the forward design framework

The schematic of our framework is depicted in Fig. 1 . DNN trained with the initial training dataset is capable of making a reliable prediction on the design space slightly larger than the training data domain, as represented in the bluish region. To find the materials with desired properties, which are positioned outside the domain of initial training data, DNN should be able to make a reliable prediction on the domain containing the desired design. In this regard, using the trained DNN to predict the properties of new material designs proposed by the genetic algorithm, a relatively small set of materials superior to those in the existing dataset is suggested. Since the newly proposed materials are outside of the current training set and the DNN predictions on them are not accurate, their properties are evaluated again with accurate physics-based simulations (if high-throughput experimental facility is available, one can use experiments). Those data are integrated to the training dataset with a data augmentation technique, and the DNN is updated based on the new training data with active transfer learning as represented with a black arrow. This process is repeated until the DNN is able to make a reliable prediction in the domain close to the optimal point represented as the large redpoint. The DNN after the last update is used to find the optimal design. A detailed explanation of our framework is provided in the following sections.

### Architectures of the deep neural network (DNN)

To leverage the prediction of DNN on the unseen domain, the DNN architecture consists of an unbounded activation function, i.e., leaky rectified linear unit activation function (leaky ReLU) with coefficient 0.1 46, 52 (See the comparison with other activation functions in Supplementary Figure 1 ). The architectures are constructed based on residual network (Resnet) with full preactivation, which is known for good generalization performance with a sufficient number of learnable parameters, with batch normalization layer as regularization methods 54, 55 (See the details of DNN architecture in Supplementary Figure 2 ). We check the predictive performance of the DNN in the seen and unseen domains by setting the randomly chosen 10% of data as validation sets, and the dataset with the highest 10% output values as validation sets, respectively. In the optimization procedure, one has to explore the dataset having output values higher than those of the initial training set. Hence, validation on the dataset with the highest 10% output values for the DNN trained on the dataset with the lowest 90% output values would represent the predictive performance of the DNN in the unseen domain during the optimization procedure. The flowchart representing the process for constructing the DNN architecture is depicted in Supplementary Figure 3 .

### Prediction results upon seen domain and unseen domain

In this study, we demonstrate the applicability of our framework by solving a representative problem with a large design spacethe design of composite microstructures with superior mechanical properties, i.e., stiffness, strength, and toughness, which are close to the global optimum located far beyond the domain of initial training data. The details of data generations are presented in the Methods section and Fig. 2 . The training results of DNN regarding stiffness and strength upon seen and unseen domains are represented in Fig. 3 . The prediction accuracy gradually decreases as data is located further away from the training data, as reported in the literature 44, 52 . The training results on seen domain generally show better results compared to the results on the unseen domain, as expected. Still, despite the mismatch in the absolute values, the DNN network is able to distinguish relative magnitudes to some extent, as shown in Fig. 3c-d . However, the training results for toughness show that it is infeasible to make predictions on unseen output value range ( Supplementary Figure 4) . We suspect that the poor predictive performance on toughness originates from the complexity in determining toughness from the entire stress-strain curve encompassing the full failure process involving complex crack propagation and branching process. We expect that this challenge might be overcome with the sequential learning methods that can learn the complex and nonlinear material behavior beyond the onset of yield or failure 56, 57 . However, because it is beyond the scope of this study, we leave the optimization of toughness as future work. In the stiffness and strength training results in an unseen domain, the DNN predictions gradually deviate more as the data is positioned further away from the training dataset.

### Material design process

A flowchart of the proposed material design framework is depicted in Fig. 4 . DNN tested with randomly selected validation sets are adopted to allow reliable prediction in a broader domain of output values. For the genetic algorithm, 30 microstructures having the highest properties are selected for the mating pool as a greedy sampling method to enable sufficient genomic variations at each generation. We note that selecting the proper amount of data for the mating pool is important when considering the tradeoff between the risk of being stuck in local minima and computational time. Additionally, we utilize the intuition from solid mechanics that the symmetrical microstructure is beneficial for the load-bearing capacity and that soft material at the crack tip is able to relieve the stress concentration at the crack tip 1, 4 . A hyper-heuristic genetic algorithm combining this domain knowledge is implemented by constraining the explored microstructure design to satisfy the prescribed conditions. The constraints accelerated the optimization process compared to conventional particle swarm optimization and genetic algorithm (See the details of the comparison for each optimization method in Supplementary Figure 6 ). In a genetic algorithm, the crossovers are implemented by selecting two microstructures from the mating pool as parents and randomly assigning stiff material to the area occupied by stiff materials in parent configurations. The mutations are applied by randomly switching the position of stiff material block and soft material block by keeping the ratio between the stiff and soft blocks. Approximately 4 × 10 4 unique candidate microstructures are generated from the mating pool at each generation.

### Composite microstructures with maximum mechanical properties

The design process for maximizing stiffness and strength is represented in Fig. 5 . The data points at the 0th update represent the initial training dataset. In the design process for maximizing stiffness shown in Fig. 5 (a) , approximately 1.6 × 10 5 unique microstructures are investigated within 4 h through DNN. This corresponds to the several orders of magnitude speedup compared to FEA simulation tools which would take more than 8 weeks for the generation of 10 5 data. In the design process for maximum stiffness, a significant improvement is observed with the initial training of DNN, because the stiffness prediction upon unseen output value range indicates that the DNN is able to distinguish the relative magnitudes of stiffness despite some mismatch in absolute values. We hypothesize that the moderate level of extrapolation beyond the seen domain is made possible due to the piecewise linear unbound function from leaky ReLU used in the DNN. Indeed, our test on various activation functions shows that unbounded ReLU-based DNN has reasonable predictive power on the unseen domain, while bounded activation functions are inefficient for the task (Supplementary Figure 1) . The iterative update of DNN is also beneficial in making robust improvements on local minima explorable with the DNN and in escaping from local minima, as demonstrated by the gradual improvement of converged values shown in Fig. 5a . Given that almost identical microstructure designs come out from the 3rd and 4th updates of DNN, we believe that the design process is converged at the optimization process after the 4th update. An identical process is also applied for finding the microstructure with the maximum strength, which is shown in Fig. 5b . The maximum strength value increases until we update the DNN iteratively five times.

### DISCUSSION

In this study, we propose a systematic forward material design framework to obtain superior design far beyond the domain of the initial training dataset. The framework is applied to a composite microstructure design problem for obtaining the maximum mechanical properties of 11 11 grid composite, which has an astronomically high number of possible configurations. Because this type of design process inherently requires efficient search in the unseen domains, a forward design approach is adopted by gradually expanding the reliable prediction domain of DNN with active transfer learning and data augmentation. The better design candidates are firstly proposed by the genetic algorithm based on DNN predictions. The properties of the candidate are obtained with FEA calculations before they are augmented to the training dataset, in order to secure the predictive performance of the DNN for a newly added dataset. The limitations in a forward design approach, such as being stuck in local minima, are mitigated by updating DNN and controlling the mutation methods in a hyper-heuristic genetic algorithm.

### Data generation based on finite element analysis (FEA)

As a training dataset, the mechanical properties, i.e., stiffness, strength, and toughness, of two-dimensional 11 11 grid composites are obtained from finite element analysis (FEA) under plane stress conditions. The composites consist of perfectly bonded 70 stiff material blocks and 51 soft material blocks containing a pre-existing crack. The input features are formatted as one-hot binary encoding representing the position of stiff and soft materials, and the outputs are defined as corresponding mechanical properties. The 100,000 unique microstructures are constructed, and the corresponding stress-strain curves are obtained by applying uniaxial tension with quasi-static infinitesimal strain increment of 0.0000227 until the complete fracture occurs. 100,000 data correspond to the fraction of~10 −29 out of the total number of available combinations, C 120; 70 ð Þ$10 34 . The stiffness, strength, and toughness are measured by the initial gradient of a stress-strain curve, the maximum stress point, and the total area under the stress-strain curve, respectively. The materials are assumed as linear elastic materials with the following elastic modulus ðEÞ, Poisson's ratio (v) and critical strain energy release rate (G c ), respectively, for stiff and soft materials: For the simulation of the crack growth, the hybrid crack phase-field (CPF) model are adopted in commercial FEA software ABAQUS with user-element subroutine 60 . The hybrid CPF model enables the modeling of complex crack nucleation and propagation by describing the failure of material with a continuous scalar field called crack phase field dðxÞ. The material completely loses its load-bearing capacity when dðxÞ reach to 1, whereas d x ð Þ ¼ 0 indicates the absence of any damage. A detailed explanation and implementation of the model can be found in our previous study 60 . Fig. 7 Histogram of optimization results. Histogram of (a) stiffness and (b) strength after the optimization. The initial dataset are colored black, the data from 1st, 2nd, 3rd, 4th, and 5th updates of DNN are colored red, green, blue, purple, and cyan, respectively.


==================================

## Paper 13

### Title

Exceptional damage-tolerance of a medium-entropy alloy CrCoNi at cryogenic temperatures

### Authors

Gludovatz Bernd, Hohenwarter Anton, Thurston Keli V. S., Bei Hongbin, Wu Zhenggang, George Easo P., Ritchie Robert O.

### Abstract

<jats:title>Abstract</jats:title><jats:p>High-entropy alloys are an intriguing new class of metallic materials that derive their properties from being multi-element systems that can crystallize as a single phase, despite containing high concentrations of five or more elements with different crystal structures. Here we examine an equiatomic medium-entropy alloy containing only three elements, CrCoNi, as a single-phase face-centred cubic solid solution, which displays strength-toughness properties that exceed those of all high-entropy alloys and most multi-phase alloys. At room temperature, the alloy shows tensile strengths of almost 1 GPa, failure strains of ∼70% and <jats:italic>K</jats:italic><jats:sub>JIc</jats:sub> fracture-toughness values above 200 MPa m<jats:sup>1/2</jats:sup>; at cryogenic temperatures strength, ductility and toughness of the CrCoNi alloy improve to strength levels above 1.3 GPa, failure strains up to 90% and <jats:italic>K</jats:italic><jats:sub>JIc</jats:sub> values of 275 MPa m<jats:sup>1/2</jats:sup>. Such properties appear to result from continuous steady strain hardening, which acts to suppress plastic instability, resulting from pronounced dislocation activity and deformation-induced nano-twinning.</jats:p>

### Journal

Nat Commun

### DOI

10.1038/ncomms10602

### Date

2016/2/2

### Subject

General Physics and Astronomy, General Biochemistry, Genetics and Molecular Biology, General Chemistry, Multidisciplinary

### E

quiatomic multi-component metallic materials, referred to variously as high-entropy alloys (HEAs), multi-component alloys or compositionally complex alloys, have generated considerable excitement in the materials science community of late as a new class of materials that derive their properties not from a single dominant constituent, such as iron in steels, but rather from multiple principal elements with the potential for unique combinations of mechanical properties compared with conventional alloys [1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11] [12] [13] [14] [15] [16] [17] [18] [19] . Much of the interest is predicated on the belief that many new alloys with useful properties are likely to be discovered near the centres (as opposed to the corners) of phase diagrams in compositionally complex systems 17 .

### Microstructure.

The CrCoNi MEA was produced from high-purity elements (499.9% pure) which were arc-melted under argon atmosphere and drop-cast into rectangular cross-section copper moulds followed by cold forging and cross rolling at room temperature into sheets of roughly 10 mm thickness (Fig. 1a) . Following recrystallization, optical microscopy ( Fig. 1b) , scanning electron microscopy (SEM) ( Fig. 1c) and electron back-scattered diffraction (EBSD; Fig. 1d ) images taken from the cross-section of the sheets revealed an equiaxed grain structure with a variable grain size of 5-50 mm and numerous recrystallization twins (inset of Fig. 1c) ; the equiatomic elemental distribution of the alloy can be seen from energy-dispersive X-ray (EDX) spectroscopy in Fig. 1e . Uniaxial tensile specimens and compact-tension C(T) fracture-toughness specimens were cut from the sheets using electrical discharge machining; the C(T) samples were fatigue precracked and subsequently side-grooved, in general accordance with ASTM standard E1820 (ref. 26) .

### Discussion

To seek the origins of such strength, ductility and fracture resistance between 293 and 77 K, we conducted detailed SEM analysis of the vicinity of the propagated crack; this was performed on samples sliced in two through the thickness to ensure that deformation conditions had been in fully plane strain (Fig. 3a) . The EBSD scans taken in the wake of the propagated crack of a sample tested at 293 K (Fig. 3b) , ahead of the crack tip of a sample tested at 198 K ( Fig. 3c ) and at a crack flank of a sample tested at 77 K (Fig. 3d) show grain misorientations as gradual changes in colour within individual grains indicative of significant amounts of dislocation plasticity. Similarly, back-scattered electron (BSE) scans taken on specimens fractured at room ( Fig. 3b ) and cryogenic temperatures (Fig. 3d) show the formation of pronounced dislocation cell structures akin to the five-component CrMnFeCoNi HEA where dislocation motion is associated with glide of ½o1104 dislocations on {111} planes 7 , a typical deformation mechanism for fcc materials, which we presume also occurs in our three-component CrCoNi MEA. In addition, the EBSD scans show a few recrystallization twins in all samples (approximately one or two per grain) as well as the presence of deformation-induced nano-twins at 77 K (Fig. 3d) . The BSE images, however, clearly reveal that deformation-induced nano-twinning is a dominant deformation mechanism occurring initially at room temperature but with increasing intensity at 198 and 77 K. From the images in Fig. 3 , the nano-twins in the EBSD scans become very clear by overlaying the scan on an image quality, IQ, map of the same data set, which permits the measurement of the typical misorientation angle of 60°for twinning (Fig. 3e) . We conclude from these results that between room and cryogenic temperatures where the strength, ductility and toughness of the mediumentropy CrCoNi are all simultaneously enhanced, nano-twinning contributes an important additional deformation mode that helps alleviate the deleterious effects of high strength that would normally be expected to result in lower toughness 29 .

